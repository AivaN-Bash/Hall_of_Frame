package com.halloffame.service;

import com.halloffame.dto.EntryDto.*;
import com.halloffame.entity.CategoryEntity;
import com.halloffame.entity.EntryEntity;
import com.halloffame.entity.TagEntity;
import com.halloffame.exception.ResourceNotFoundException;
import com.halloffame.repository.CategoryRepository;
import com.halloffame.repository.EntryRepository;
import com.halloffame.repository.TagRepository;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EntryService {

    private final EntryRepository entryRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;

    public EntryService(
        EntryRepository entryRepository,
        CategoryRepository categoryRepository,
        TagRepository tagRepository
    ) {
        this.entryRepository = entryRepository;
        this.categoryRepository = categoryRepository;
        this.tagRepository = tagRepository;
    }

    @Transactional(readOnly = true)
    public List<EntrySummary> listEntries(String categorySlug, String tagSlug, String q, String sort, Boolean featured) {
        Specification<EntryEntity> spec = (root, query, cb) -> {
            if (query != null && !Long.class.equals(query.getResultType())) {
                root.fetch("category", JoinType.LEFT);
                query.distinct(true);
            }
            List<Predicate> predicates = new ArrayList<>();
            if (categorySlug != null && !categorySlug.isBlank()) {
                predicates.add(cb.equal(root.get("category").get("slug"), categorySlug.trim()));
            }
            if (tagSlug != null && !tagSlug.isBlank()) {
                Join<EntryEntity, TagEntity> tagJoin = root.join("tags", JoinType.INNER);
                predicates.add(cb.equal(tagJoin.get("slug"), tagSlug.trim()));
            }
            if (featured != null) {
                predicates.add(cb.equal(root.get("featured"), featured));
            }
            if (q != null && !q.isBlank()) {
                String pattern = "%" + q.trim().toLowerCase(Locale.ROOT) + "%";
                predicates.add(cb.or(
                    cb.like(cb.lower(root.get("title")), pattern),
                    cb.like(cb.lower(cb.coalesce(root.get("tagline"), "")), pattern),
                    cb.like(cb.lower(root.get("whyHooked")), pattern)
                ));
            }
            return cb.and(predicates.toArray(Predicate[]::new));
        };

        Sort springSort = resolveSort(sort);
        List<EntryEntity> results = entryRepository.findAll(spec, springSort);
        if ("rating".equalsIgnoreCase(sort)) {
            results = results.stream()
                .sorted(Comparator
                    .comparing(EntryEntity::getRating, Comparator.nullsLast(Comparator.reverseOrder()))
                    .thenComparingInt(EntryEntity::getRankOrder)
                    .thenComparingLong(EntryEntity::getId))
                .toList();
        }
        return results.stream().map(this::toSummary).toList();
    }

    @Transactional(readOnly = true)
    public EntryDetail getBySlug(String slug) {
        EntryEntity entry = entryRepository.findWithDetailsBySlug(slug)
            .orElseThrow(() -> new ResourceNotFoundException("Entry not found"));

        List<EntryEntity> siblings = entryRepository.findByCategoryIdOrderByRankOrderAscIdAsc(entry.getCategory().getId());
        EntryNavItem prev = null;
        EntryNavItem next = null;
        for (int i = 0; i < siblings.size(); i++) {
            if (siblings.get(i).getId().equals(entry.getId())) {
                if (i > 0) {
                    EntryEntity p = siblings.get(i - 1);
                    prev = new EntryNavItem(p.getTitle(), p.getSlug());
                }
                if (i + 1 < siblings.size()) {
                    EntryEntity n = siblings.get(i + 1);
                    next = new EntryNavItem(n.getTitle(), n.getSlug());
                }
                break;
            }
        }

        List<Long> tagIds = entry.getTags().stream().map(TagEntity::getId).toList();
        List<EntrySummary> related = List.of();
        if (!tagIds.isEmpty()) {
            Set<Long> currentTagIds = Set.copyOf(tagIds);
            related = entryRepository.findRelatedByTagIds(entry.getId(), tagIds).stream()
                .sorted(Comparator.<EntryEntity>comparingLong(other ->
                    -other.getTags().stream().filter(t -> currentTagIds.contains(t.getId())).count()
                ).thenComparingInt(EntryEntity::getRankOrder))
                .limit(4)
                .map(this::toSummary)
                .toList();
        }

        return toDetail(entry, prev, next, related);
    }

    @Transactional
    public EntryDetail create(UpsertEntryRequest req) {
        CategoryEntity category = categoryRepository.findById(req.categoryId())
            .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        EntryEntity entry = new EntryEntity();
        applyFields(entry, category, req);
        entry.setSlug(SlugUtil.uniqueSlug(req.title(), entryRepository::existsBySlug));
        if (req.rankOrder() == null) {
            List<EntryEntity> siblings = entryRepository.findByCategoryIdOrderByRankOrderAscIdAsc(category.getId());
            int nextRank = siblings.isEmpty() ? 1 : siblings.get(siblings.size() - 1).getRankOrder() + 1;
            entry.setRankOrder(nextRank);
        }
        EntryEntity saved = entryRepository.save(entry);
        return getBySlug(saved.getSlug());
    }

    @Transactional
    public EntryDetail update(Long id, UpsertEntryRequest req) {
        EntryEntity entry = entryRepository.findWithDetailsById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Entry not found"));
        CategoryEntity category = categoryRepository.findById(req.categoryId())
            .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        String newTitle = req.title().trim();
        if (!entry.getTitle().equalsIgnoreCase(newTitle)) {
            entry.setSlug(SlugUtil.uniqueSlug(newTitle, candidate -> entryRepository.existsBySlugAndIdNot(candidate, id)));
        }
        applyFields(entry, category, req);
        EntryEntity saved = entryRepository.save(entry);
        return getBySlug(saved.getSlug());
    }

    @Transactional
    public void delete(Long id) {
        EntryEntity entry = entryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Entry not found"));
        entryRepository.delete(entry);
    }

    @Transactional
    public void reorder(ReorderEntriesRequest req) {
        List<Long> ids = req.items().stream().map(ReorderItem::id).toList();
        Map<Long, EntryEntity> byId = entryRepository.findAllById(ids).stream()
            .collect(Collectors.toMap(EntryEntity::getId, Function.identity()));
        for (ReorderItem item : req.items()) {
            EntryEntity entry = byId.get(item.id());
            if (entry == null) {
                throw new ResourceNotFoundException("Entry " + item.id() + " not found");
            }
            entry.setRankOrder(item.rankOrder());
        }
        entryRepository.saveAll(byId.values());
    }

    private void applyFields(EntryEntity entry, CategoryEntity category, UpsertEntryRequest req) {
        entry.setCategory(category);
        entry.setTitle(req.title().trim());
        entry.setReleaseYear(req.releaseYear());
        entry.setPosterUrl(blankToNull(req.posterUrl()));
        entry.setAccentColor(blankToNull(req.accentColor()));
        entry.setTagline(blankToNull(req.tagline()));
        entry.setRating(req.rating());
        entry.setTier(req.tier());
        entry.setWhyHooked(req.whyHooked().trim());
        entry.setFavoriteMoment(blankToNull(req.favoriteMoment()));
        entry.setFavoriteQuoteOrChar(blankToNull(req.favoriteQuoteOrChar()));
        entry.setFeatured(Boolean.TRUE.equals(req.featured()));
        if (req.rankOrder() != null) {
            entry.setRankOrder(req.rankOrder());
        }
        entry.setTags(resolveTags(req.tags()));
    }

    private Set<TagEntity> resolveTags(List<String> rawTags) {
        Set<TagEntity> result = new LinkedHashSet<>();
        if (rawTags == null) return result;
        for (String raw : rawTags) {
            if (raw == null || raw.isBlank()) continue;
            String cleanName = raw.trim();
            String slug = SlugUtil.toSlug(cleanName);
            TagEntity tag = tagRepository.findBySlug(slug).orElseGet(() -> {
                TagEntity t = new TagEntity();
                t.setName(cleanName);
                t.setSlug(slug);
                return tagRepository.save(t);
            });
            result.add(tag);
        }
        return result;
    }

    private Sort resolveSort(String sort) {
        if ("newest".equalsIgnoreCase(sort)) {
            return Sort.by(Sort.Order.desc("createdAt"), Sort.Order.desc("id"));
        }
        return Sort.by(Sort.Order.asc("rankOrder"), Sort.Order.asc("id"));
    }

    private static String blankToNull(String value) {
        return (value == null || value.isBlank()) ? null : value.trim();
    }

    private EntrySummary toSummary(EntryEntity e) {
        return new EntrySummary(
            e.getId(),
            e.getCategory().getId(),
            e.getCategory().getName(),
            e.getCategory().getSlug(),
            e.getTitle(),
            e.getSlug(),
            e.getReleaseYear(),
            e.getPosterUrl(),
            e.getAccentColor(),
            e.getTagline(),
            e.getRating(),
            e.getTier(),
            e.isFeatured(),
            e.getRankOrder(),
            e.getTags().stream().map(t -> new TagDto(t.getId(), t.getName(), t.getSlug())).toList(),
            e.getCreatedAt(),
            e.getUpdatedAt()
        );
    }

    private EntryDetail toDetail(
        EntryEntity e,
        EntryNavItem prev,
        EntryNavItem next,
        List<EntrySummary> related
    ) {
        return new EntryDetail(
            e.getId(),
            e.getCategory().getId(),
            e.getCategory().getName(),
            e.getCategory().getSlug(),
            e.getTitle(),
            e.getSlug(),
            e.getReleaseYear(),
            e.getPosterUrl(),
            e.getAccentColor(),
            e.getTagline(),
            e.getRating(),
            e.getTier(),
            e.getWhyHooked(),
            e.getFavoriteMoment(),
            e.getFavoriteQuoteOrChar(),
            e.isFeatured(),
            e.getRankOrder(),
            e.getTags().stream().map(t -> new TagDto(t.getId(), t.getName(), t.getSlug())).toList(),
            prev,
            next,
            related,
            e.getCreatedAt(),
            e.getUpdatedAt()
        );
    }
}
