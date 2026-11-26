package com.halloffame.controller;

import com.halloffame.dto.EntryDto.*;
import com.halloffame.service.EntryService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/entries")
public class EntryController {

    private final EntryService entryService;

    public EntryController(EntryService entryService) {
        this.entryService = entryService;
    }

    @GetMapping
    public List<EntrySummary> list(
        @RequestParam(required = false) String category,
        @RequestParam(required = false) String tag,
        @RequestParam(required = false) String q,
        @RequestParam(required = false, defaultValue = "rank") String sort,
        @RequestParam(required = false) Boolean featured
    ) {
        return entryService.listEntries(category, tag, q, sort, featured);
    }

    @GetMapping("/{slug}")
    public EntryDetail getBySlug(@PathVariable String slug) {
        return entryService.getBySlug(slug);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EntryDetail create(@Valid @RequestBody UpsertEntryRequest request) {
        return entryService.create(request);
    }

    @PutMapping("/{id}")
    public EntryDetail update(@PathVariable Long id, @Valid @RequestBody UpsertEntryRequest request) {
        return entryService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        entryService.delete(id);
    }

    @PatchMapping("/reorder")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void reorder(@Valid @RequestBody ReorderEntriesRequest request) {
        entryService.reorder(request);
    }
}
