package com.halloffame.repository;

import com.halloffame.entity.EntryEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.lang.Nullable;

public interface EntryRepository extends JpaRepository<EntryEntity, Long>, JpaSpecificationExecutor<EntryEntity> {

    @Override
    @EntityGraph(attributePaths = {"category", "tags"})
    List<EntryEntity> findAll(@Nullable Specification<EntryEntity> spec, Sort sort);

    @EntityGraph(attributePaths = {"category", "tags"})
    Optional<EntryEntity> findWithDetailsBySlug(String slug);

    @EntityGraph(attributePaths = {"category", "tags"})
    Optional<EntryEntity> findWithDetailsById(Long id);

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, Long id);

    long countByCategoryId(Long categoryId);

    @EntityGraph(attributePaths = {"category", "tags"})
    List<EntryEntity> findAllByOrderByRankOrderAscIdAsc();

    @EntityGraph(attributePaths = {"category", "tags"})
    List<EntryEntity> findByCategoryIdOrderByRankOrderAscIdAsc(Long categoryId);

    @Query("""
        SELECT DISTINCT e FROM EntryEntity e
        LEFT JOIN FETCH e.category
        LEFT JOIN FETCH e.tags t
        WHERE e.id <> :entryId AND t.id IN :tagIds
        ORDER BY e.rankOrder ASC, e.id ASC
        """)
    List<EntryEntity> findRelatedByTagIds(@Param("entryId") Long entryId, @Param("tagIds") List<Long> tagIds);
}
