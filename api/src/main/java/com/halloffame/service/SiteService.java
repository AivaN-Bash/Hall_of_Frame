package com.halloffame.service;

import com.halloffame.dto.SiteDto.SiteResponse;
import com.halloffame.dto.SiteDto.UpdateSiteRequest;
import com.halloffame.entity.SiteSettingsEntity;
import com.halloffame.exception.ResourceNotFoundException;
import com.halloffame.repository.EntryRepository;
import com.halloffame.repository.SiteSettingsRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SiteService {

    private final SiteSettingsRepository siteSettingsRepository;
    private final EntryRepository entryRepository;

    public SiteService(SiteSettingsRepository siteSettingsRepository, EntryRepository entryRepository) {
        this.siteSettingsRepository = siteSettingsRepository;
        this.entryRepository = entryRepository;
    }

    @Transactional(readOnly = true)
    public SiteResponse getSite() {
        SiteSettingsEntity s = siteSettingsRepository.findById((short) 1)
            .orElseThrow(() -> new ResourceNotFoundException("Site settings not initialized"));
        return toResponse(s);
    }

    @Transactional
    public SiteResponse updateSite(UpdateSiteRequest req) {
        SiteSettingsEntity s = siteSettingsRepository.findById((short) 1)
            .orElseThrow(() -> new ResourceNotFoundException("Site settings not initialized"));
        s.setSiteName(req.siteName().trim());
        s.setGreeting(req.greeting().trim());
        s.setHeroName(req.heroName().trim());
        s.setHeroBio(req.heroBio().trim());
        s.setPortraitUrl(req.portraitUrl() != null ? req.portraitUrl().trim() : "");
        s.setAboutBio(req.aboutBio().trim());
        s.setAboutPurpose(req.aboutPurpose().trim());
        s.setCurrentlyWatchingPlaying(req.currentlyWatchingPlaying().trim());
        return toResponse(siteSettingsRepository.save(s));
    }

    private SiteResponse toResponse(SiteSettingsEntity s) {
        return new SiteResponse(
            s.getSiteName(),
            s.getGreeting(),
            s.getHeroName(),
            s.getHeroBio(),
            s.getPortraitUrl(),
            s.getAboutBio(),
            s.getAboutPurpose(),
            s.getCurrentlyWatchingPlaying(),
            entryRepository.count()
        );
    }
}
