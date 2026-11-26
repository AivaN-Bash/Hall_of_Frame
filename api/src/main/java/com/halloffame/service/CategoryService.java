package com.halloffame.service;

import com.halloffame.dto.CategoryDto.*;
import com.halloffame.entity.CategoryEntity;
import com.halloffame.entity.EntryEntity;
import com.halloffame.exception.ConflictException;
import com.halloffame.exception.ResourceNotFoundException;
import com.halloffame.repository.CategoryRepository;
import com.halloffame.repository.EntryRepository;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final EntryRepository entryRepository;

    public CategoryService(CategoryRepository categoryRepository, EntryRepository entryRepository) {
        this.categoryRepository = categoryRepository;
        this.entryRepository = entryRepository;
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> getAll() {
        List<CategoryEntity> categories = categoryRepository.findAllByOrderBySortOrderAscIdAsc();
        Map<Long, List<EntryEntity>> entriesByCat = entryRepository.findAllByOrderByRankOrderAscIdAsc()
            .stream()
            .collect(Collectors.groupingBy(e -> e.getCategory().getId()));

        return categories.stream().map(cat -> {
            List<EntryEntity> list = entriesByCat.getOrDefault(cat.getId(), List.of());
            List<CategoryEntryPreview> previews = list.stream()
                .map(e -> new CategoryEntryPreview(
                    e.getId(),
                    e.getTitle(),
                    e.getSlug(),
                    e.getReleaseYear(),
                    e.getPosterUrl(),
                    e.getTier().name()
                ))
                .toList();
            return new CategoryResponse(
                cat.getId(),
                cat.getName(),
                cat.getSlug(),
                cat.getSortOrder(),
                cat.getArtSeed(),
                list.size(),
                previews
            );
        }).toList();
    }

    @Transactional
    public CategoryResponse create(CreateCategoryRequest req) {
        List<CategoryEntity> existing = categoryRepository.findAllByOrderBySortOrderAscIdAsc();
        int nextOrder = existing.isEmpty() ? 1 : existing.get(existing.size() - 1).getSortOrder() + 1;

        CategoryEntity cat = new CategoryEntity();
        cat.setName(req.name().trim());
        cat.setSlug(SlugUtil.uniqueSlug(req.name(), categoryRepository::existsBySlug));
        cat.setSortOrder(req.sortOrder() != null ? req.sortOrder() : nextOrder);
        cat.setArtSeed(req.artSeed() != null ? req.artSeed() : (existing.size() * 7 + 3));
        CategoryEntity saved = categoryRepository.save(cat);

        return new CategoryResponse(
            saved.getId(),
            saved.getName(),
            saved.getSlug(),
            saved.getSortOrder(),
            saved.getArtSeed(),
            0,
            List.of()
        );
    }

    @Transactional
    public CategoryResponse update(Long id, UpdateCategoryRequest req) {
        CategoryEntity cat = categoryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        String trimmed = req.name().trim();
        if (!cat.getName().equalsIgnoreCase(trimmed)) {
            cat.setSlug(SlugUtil.uniqueSlug(trimmed, slug ->
                categoryRepository.findBySlug(slug).filter(other -> !other.getId().equals(id)).isPresent()
            ));
        }
        cat.setName(trimmed);
        if (req.sortOrder() != null) cat.setSortOrder(req.sortOrder());
        if (req.artSeed() != null) cat.setArtSeed(req.artSeed());
        CategoryEntity saved = categoryRepository.save(cat);

        List<CategoryEntryPreview> previews = entryRepository.findByCategoryIdOrderByRankOrderAscIdAsc(id).stream()
            .map(e -> new CategoryEntryPreview(
                e.getId(), e.getTitle(), e.getSlug(), e.getReleaseYear(), e.getPosterUrl(), e.getTier().name()
            ))
            .toList();

        return new CategoryResponse(
            saved.getId(),
            saved.getName(),
            saved.getSlug(),
            saved.getSortOrder(),
            saved.getArtSeed(),
            previews.size(),
            previews
        );
    }

    @Transactional
    public void delete(Long id) {
        CategoryEntity cat = categoryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        long count = entryRepository.countByCategoryId(id);
        if (count > 0) {
            throw new ConflictException("Cannot delete category '" + cat.getName() + "' while it still has " + count + " entries.");
        }
        categoryRepository.delete(cat);
    }

    @Transactional
    public List<CategoryResponse> reorder(ReorderCategoriesRequest req) {
        for (ReorderItem item : req.items()) {
            CategoryEntity cat = categoryRepository.findById(item.id())
                .orElseThrow(() -> new ResourceNotFoundException("Category " + item.id() + " not found"));
            cat.setSortOrder(item.sortOrder());
            categoryRepository.save(cat);
        }
        return getAll();
    }
}
