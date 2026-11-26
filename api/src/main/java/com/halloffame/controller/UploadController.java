package com.halloffame.controller;

import com.halloffame.service.StorageService;
import com.halloffame.service.StorageService.LoadedFile;
import com.halloffame.service.StorageService.StoredFile;
import java.util.concurrent.TimeUnit;
import org.springframework.core.io.Resource;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/uploads")
public class UploadController {

    private final StorageService storageService;

    public UploadController(StorageService storageService) {
        this.storageService = storageService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public StoredFile upload(@RequestParam("file") MultipartFile file) {
        return storageService.storeImage(file);
    }

    @GetMapping("/{filename}")
    public ResponseEntity<Resource> serve(@PathVariable String filename) {
        LoadedFile loaded = storageService.loadImage(filename);
        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(loaded.contentType()))
            .cacheControl(CacheControl.maxAge(7, TimeUnit.DAYS).cachePublic())
            .body(loaded.resource());
    }
}
