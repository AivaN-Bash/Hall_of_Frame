package com.halloffame.dto;

import com.halloffame.entity.EntryEntity;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public final class EntryDto {
    private EntryDto() {}

    public record TagDto(Long id, String name, String slug) {}

    public record EntryNavItem(String title, String slug) {}

    public record EntrySummary(
        Long id,
        Long categoryId,
        String categoryName,
        String categorySlug,
        String title,
        String slug,
        Integer releaseYear,
        String posterUrl,
        String accentColor,
        String tagline,
        BigDecimal rating,
        EntryEntity.Tier tier,
        boolean featured,
        int rankOrder,
        List<TagDto> tags,
        Instant createdAt,
        Instant updatedAt
    ) {}

    public record EntryDetail(
        Long id,
        Long categoryId,
        String categoryName,
        String categorySlug,
        String title,
        String slug,
        Integer releaseYear,
        String posterUrl,
        String accentColor,
        String tagline,
        BigDecimal rating,
        EntryEntity.Tier tier,
        String whyHooked,
        String favoriteMoment,
        String favoriteQuoteOrChar,
        boolean featured,
        int rankOrder,
        List<TagDto> tags,
        EntryNavItem previousEntry,
        EntryNavItem nextEntry,
        List<EntrySummary> relatedEntries,
        Instant createdAt,
        Instant updatedAt
    ) {}

    public record UpsertEntryRequest(
        @NotNull(message = "Category is required") Long categoryId,
        @NotBlank(message = "Title is required") @Size(max = 160) String title,
        @Min(1888) @Max(2100) Integer releaseYear,
        @Size(max = 20000) String posterUrl,
        @Pattern(regexp = "^$|^#[0-9a-fA-F]{6}$", message = "Accent color must be a #RRGGBB hex code") String accentColor,
        @Size(max = 280) String tagline,
        @DecimalMin("0.0") @DecimalMax("10.0") BigDecimal rating,
        @NotNull(message = "Tier is required") EntryEntity.Tier tier,
        @NotBlank(message = "Why it hooked me is required") @Size(max = 20000) String whyHooked,
        @Size(max = 10000) String favoriteMoment,
        @Size(max = 2000) String favoriteQuoteOrChar,
        Boolean featured,
        @Min(0) Integer rankOrder,
        List<@NotBlank @Size(max = 60) String> tags
    ) {}

    public record ReorderItem(
        @NotNull Long id,
        @NotNull @Min(0) Integer rankOrder
    ) {}

    public record ReorderEntriesRequest(
        @NotEmpty List<ReorderItem> items
    ) {}
}
