package com.halloffame.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public final class CategoryDto {
    private CategoryDto() {}

    public record CategoryEntryPreview(
        Long id,
        String title,
        String slug,
        Integer releaseYear,
        String posterUrl,
        String tier
    ) {}

    public record CategoryResponse(
        Long id,
        String name,
        String slug,
        int sortOrder,
        int artSeed,
        long entryCount,
        List<CategoryEntryPreview> entries
    ) {}

    public record CreateCategoryRequest(
        @NotBlank @Size(max = 80) String name,
        @Min(0) Integer sortOrder,
        @Min(1) Integer artSeed
    ) {}

    public record UpdateCategoryRequest(
        @NotBlank @Size(max = 80) String name,
        @Min(0) Integer sortOrder,
        @Min(1) Integer artSeed
    ) {}

    public record ReorderItem(
        @NotNull Long id,
        @NotNull @Min(0) Integer sortOrder
    ) {}

    public record ReorderCategoriesRequest(
        @NotEmpty List<ReorderItem> items
    ) {}
}
