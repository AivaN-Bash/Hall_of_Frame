package com.halloffame.repository;

import com.halloffame.entity.TagEntity;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TagRepository extends JpaRepository<TagEntity, Long> {
    Optional<TagEntity> findBySlug(String slug);
}
