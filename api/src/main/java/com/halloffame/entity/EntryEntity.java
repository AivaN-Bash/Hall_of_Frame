package com.halloffame.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "entries")
public class EntryEntity {

    public enum Tier {
        S, A, B, C
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private CategoryEntity category;

    @Column(nullable = false, length = 160)
    private String title;

    @Column(nullable = false, unique = true, length = 180)
    private String slug;

    @Column(name = "release_year")
    private Integer releaseYear;

    @Column(name = "poster_url", columnDefinition = "TEXT")
    private String posterUrl;

    @Column(name = "accent_color", length = 7)
    private String accentColor;

    @Column(length = 280)
    private String tagline;

    @Column(precision = 3, scale = 1)
    private BigDecimal rating;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 1)
    private Tier tier = Tier.A;

    @Column(name = "why_hooked", nullable = false, columnDefinition = "TEXT")
    private String whyHooked;

    @Column(name = "favorite_moment", columnDefinition = "TEXT")
    private String favoriteMoment;

    @Column(name = "favorite_quote_or_char", columnDefinition = "TEXT")
    private String favoriteQuoteOrChar;

    @Column(nullable = false)
    private boolean featured = false;

    @Column(name = "rank_order", nullable = false)
    private int rankOrder = 0;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "entry_tags",
        joinColumns = @JoinColumn(name = "entry_id"),
        inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    @OrderBy("name ASC")
    private Set<TagEntity> tags = new LinkedHashSet<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    void onCreate() {
        Instant now = Instant.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        this.updatedAt = Instant.now();
    }

    public Long getId() { return id; }
    public CategoryEntity getCategory() { return category; }
    public void setCategory(CategoryEntity category) { this.category = category; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public Integer getReleaseYear() { return releaseYear; }
    public void setReleaseYear(Integer releaseYear) { this.releaseYear = releaseYear; }
    public String getPosterUrl() { return posterUrl; }
    public void setPosterUrl(String posterUrl) { this.posterUrl = posterUrl; }
    public String getAccentColor() { return accentColor; }
    public void setAccentColor(String accentColor) { this.accentColor = accentColor; }
    public String getTagline() { return tagline; }
    public void setTagline(String tagline) { this.tagline = tagline; }
    public BigDecimal getRating() { return rating; }
    public void setRating(BigDecimal rating) { this.rating = rating; }
    public Tier getTier() { return tier; }
    public void setTier(Tier tier) { this.tier = tier; }
    public String getWhyHooked() { return whyHooked; }
    public void setWhyHooked(String whyHooked) { this.whyHooked = whyHooked; }
    public String getFavoriteMoment() { return favoriteMoment; }
    public void setFavoriteMoment(String favoriteMoment) { this.favoriteMoment = favoriteMoment; }
    public String getFavoriteQuoteOrChar() { return favoriteQuoteOrChar; }
    public void setFavoriteQuoteOrChar(String favoriteQuoteOrChar) { this.favoriteQuoteOrChar = favoriteQuoteOrChar; }
    public boolean isFeatured() { return featured; }
    public void setFeatured(boolean featured) { this.featured = featured; }
    public int getRankOrder() { return rankOrder; }
    public void setRankOrder(int rankOrder) { this.rankOrder = rankOrder; }
    public Set<TagEntity> getTags() { return tags; }
    public void setTags(Set<TagEntity> tags) { this.tags = tags; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
