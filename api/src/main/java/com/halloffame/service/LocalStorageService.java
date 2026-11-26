package com.halloffame.service;

import com.halloffame.config.AppProperties;
import com.halloffame.exception.BadRequestException;
import com.halloffame.exception.ResourceNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import java.util.regex.Pattern;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class LocalStorageService implements StorageService {

    private static final Pattern SAFE_FILENAME = Pattern.compile("^[a-f0-9-]+\\.(png|jpg|webp|gif)$");

    private final Path rootDir;
    private final long maxUploadBytes;

    public LocalStorageService(AppProperties properties) {
        this.rootDir = Path.of(properties.storage().localDir()).toAbsolutePath().normalize();
        this.maxUploadBytes = properties.storage().maxUploadBytes();
        try {
            Files.createDirectories(this.rootDir);
        } catch (IOException e) {
            throw new IllegalStateException("Could not initialize upload directory", e);
        }
    }

    @Override
    public StoredFile storeImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Please select an image file to upload.");
        }
        if (file.getSize() > maxUploadBytes) {
            throw new BadRequestException("Image exceeds maximum allowed size of " + (maxUploadBytes / (1024 * 1024)) + " MB.");
        }

        byte[] header = new byte[12];
        int read;
        try (InputStream in = file.getInputStream()) {
            read = in.readNBytes(header, 0, header.length);
        } catch (IOException e) {
            throw new BadRequestException("Failed to read uploaded file.");
        }

        ImageFormat format = detectFormat(header, read);
        if (format == null) {
            throw new BadRequestException("Only PNG, JPEG, WebP, and GIF images are allowed.");
        }

        String filename = UUID.randomUUID() + "." + format.ext();
        Path target = rootDir.resolve(filename).normalize();
        if (!target.startsWith(rootDir)) {
            throw new BadRequestException("Invalid target path.");
        }

        try (InputStream in = file.getInputStream()) {
            Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new IllegalStateException("Failed to store uploaded file.", e);
        }

        return new StoredFile(filename, "/api/uploads/" + filename, format.mime(), file.getSize());
    }

    @Override
    public LoadedFile loadImage(String filename) {
        if (filename == null || !SAFE_FILENAME.matcher(filename).matches()) {
            throw new ResourceNotFoundException("Image not found");
        }
        Path target = rootDir.resolve(filename).normalize();
        if (!target.startsWith(rootDir) || !Files.isRegularFile(target)) {
            throw new ResourceNotFoundException("Image not found");
        }
        try {
            Resource resource = new UrlResource(target.toUri());
            String mime = switch (filename.substring(filename.lastIndexOf('.') + 1)) {
                case "png" -> "image/png";
                case "jpg" -> "image/jpeg";
                case "webp" -> "image/webp";
                case "gif" -> "image/gif";
                default -> "application/octet-stream";
            };
            return new LoadedFile(resource, mime);
        } catch (MalformedURLException e) {
            throw new ResourceNotFoundException("Image not found");
        }
    }

    private record ImageFormat(String ext, String mime) {}

    private static ImageFormat detectFormat(byte[] b, int len) {
        if (len >= 8
            && (b[0] & 0xFF) == 0x89 && b[1] == 0x50 && b[2] == 0x4E && b[3] == 0x47
            && b[4] == 0x0D && b[5] == 0x0A && b[6] == 0x1A && b[7] == 0x0A) {
            return new ImageFormat("png", "image/png");
        }
        if (len >= 3 && (b[0] & 0xFF) == 0xFF && (b[1] & 0xFF) == 0xD8 && (b[2] & 0xFF) == 0xFF) {
            return new ImageFormat("jpg", "image/jpeg");
        }
        if (len >= 6 && b[0] == 'G' && b[1] == 'I' && b[2] == 'F' && b[3] == '8'
            && (b[4] == '7' || b[4] == '9') && b[5] == 'a') {
            return new ImageFormat("gif", "image/gif");
        }
        if (len >= 12
            && b[0] == 'R' && b[1] == 'I' && b[2] == 'F' && b[3] == 'F'
            && b[8] == 'W' && b[9] == 'E' && b[10] == 'B' && b[11] == 'P') {
            return new ImageFormat("webp", "image/webp");
        }
        return null;
    }
}
