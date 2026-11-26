package com.halloffame.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "site_settings")
public class SiteSettingsEntity {

    @Id
    private Short id = 1;

    @Column(name = "site_name", nullable = false, length = 80)
    private String siteName;

    @Column(nullable = false, length = 80)
    private String greeting;

    @Column(name = "hero_name", nullable = false, length = 80)
    private String heroName;

    @Column(name = "hero_bio", nullable = false, columnDefinition = "TEXT")
    private String heroBio;

    @Column(name = "portrait_url", columnDefinition = "TEXT")
    private String portraitUrl;

    @Column(name = "about_bio", nullable = false, columnDefinition = "TEXT")
    private String aboutBio;

    @Column(name = "about_purpose", nullable = false, columnDefinition = "TEXT")
    private String aboutPurpose;

    @Column(name = "currently_watching_playing", nullable = false, columnDefinition = "TEXT")
    private String currentlyWatchingPlaying;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    @PreUpdate
    void touch() {
        this.updatedAt = Instant.now();
    }

    public Short getId() { return id; }
    public void setId(Short id) { this.id = id; }
    public String getSiteName() { return siteName; }
    public void setSiteName(String siteName) { this.siteName = siteName; }
    public String getGreeting() { return greeting; }
    public void setGreeting(String greeting) { this.greeting = greeting; }
    public String getHeroName() { return heroName; }
    public void setHeroName(String heroName) { this.heroName = heroName; }
    public String getHeroBio() { return heroBio; }
    public void setHeroBio(String heroBio) { this.heroBio = heroBio; }
    public String getPortraitUrl() { return portraitUrl; }
    public void setPortraitUrl(String portraitUrl) { this.portraitUrl = portraitUrl; }
    public String getAboutBio() { return aboutBio; }
    public void setAboutBio(String aboutBio) { this.aboutBio = aboutBio; }
    public String getAboutPurpose() { return aboutPurpose; }
    public void setAboutPurpose(String aboutPurpose) { this.aboutPurpose = aboutPurpose; }
    public String getCurrentlyWatchingPlaying() { return currentlyWatchingPlaying; }
    public void setCurrentlyWatchingPlaying(String currentlyWatchingPlaying) { this.currentlyWatchingPlaying = currentlyWatchingPlaying; }
    public Instant getUpdatedAt() { return updatedAt; }
}
