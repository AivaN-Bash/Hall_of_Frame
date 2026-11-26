package com.halloffame.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface StorageService {

    StoredFile storeImage(MultipartFile file);

    LoadedFile loadImage(String filename);

    record StoredFile(String filename, String url, String contentType, long size) {}

    record LoadedFile(Resource resource, String contentType) {}
}
