package com.halloffame.service;

import java.text.Normalizer;
import java.util.Locale;
import java.util.function.Predicate;

public final class SlugUtil {
    private SlugUtil() {}

    public static String toSlug(String input) {
        if (input == null || input.isBlank()) {
            return "item";
        }
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD)
            .replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
        String slug = normalized.toLowerCase(Locale.ROOT)
            .replaceAll("[^a-z0-9]+", "-")
            .replaceAll("^-+|-+$", "");
        return slug.isEmpty() ? "item" : slug;
    }

    public static String uniqueSlug(String baseInput, Predicate<String> existsCheck) {
        String base = toSlug(baseInput);
        String candidate = base;
        int suffix = 2;
        while (existsCheck.test(candidate)) {
            candidate = base + "-" + suffix++;
        }
        return candidate;
    }
}
