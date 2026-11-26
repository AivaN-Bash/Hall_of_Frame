package com.halloffame.repository;

import com.halloffame.entity.SiteSettingsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SiteSettingsRepository extends JpaRepository<SiteSettingsEntity, Short> {
}
