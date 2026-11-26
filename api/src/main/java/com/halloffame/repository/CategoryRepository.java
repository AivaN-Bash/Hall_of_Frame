package com.halloffame.repository;

import com.halloffame.entity.CategoryEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<CategoryEntity, Long> {
    List<CategoryEntity> findAllByOrderBySortOrderAscIdAsc();
    Optional<CategoryEntity> findBySlug(String slug);
    boolean existsBySlug(String slug);
}
