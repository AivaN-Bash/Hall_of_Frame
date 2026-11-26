package com.halloffame.controller;

import com.halloffame.dto.SiteDto.SiteResponse;
import com.halloffame.dto.SiteDto.UpdateSiteRequest;
import com.halloffame.service.SiteService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/site")
public class SiteController {

    private final SiteService siteService;

    public SiteController(SiteService siteService) {
        this.siteService = siteService;
    }

    @GetMapping
    public SiteResponse getSite() {
        return siteService.getSite();
    }

    @PutMapping
    public SiteResponse updateSite(@Valid @RequestBody UpdateSiteRequest request) {
        return siteService.updateSite(request);
    }
}
