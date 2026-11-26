package com.halloffame.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public final class SiteDto {
    private SiteDto() {}

    public record SiteResponse(
        String siteName,
        String greeting,
        String heroName,
        String heroBio,
        String portraitUrl,
        String aboutBio,
        String aboutPurpose,
        String currentlyWatchingPlaying,
        long entryCount
    ) {}

    public record UpdateSiteRequest(
        @NotBlank @Size(max = 80) String siteName,
        @NotBlank @Size(max = 80) String greeting,
        @NotBlank @Size(max = 80) String heroName,
        @NotBlank @Size(max = 2000) String heroBio,
        @Size(max = 1000) String portraitUrl,
        @NotBlank @Size(max = 4000) String aboutBio,
        @NotBlank @Size(max = 4000) String aboutPurpose,
        @NotBlank @Size(max = 2000) String currentlyWatchingPlaying
    ) {}
}
