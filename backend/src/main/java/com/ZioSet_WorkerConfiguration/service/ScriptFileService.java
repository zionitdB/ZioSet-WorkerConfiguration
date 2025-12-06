/*package com.ZioSet_WorkerConfiguration.service;

import com.ZioSet_WorkerConfiguration.model.ScriptFileEntity;
import com.ZioSet_WorkerConfiguration.repo.ScriptFileRepository;
import com.azure.storage.blob.*;
import com.azure.storage.blob.models.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ScriptFileService {

    private final ScriptFileRepository scriptFileRepository;

    @Value("${azure.storage.connection-string}")
    private String azureConnectionString;

    @Value("${azure.storage.container-name}")
    private String containerName;

    public ScriptFileEntity uploadFile(MultipartFile file, String uploadedBy) throws Exception {
        BlobServiceClient serviceClient = new BlobServiceClientBuilder()
                .connectionString(azureConnectionString).buildClient();

        BlobContainerClient containerClient = serviceClient.getBlobContainerClient(containerName);
        if (!containerClient.exists()) containerClient.create();

        String storageKey = UUID.randomUUID() + "_" + file.getOriginalFilename();
        BlobClient blobClient = containerClient.getBlobClient(storageKey);

        try (InputStream inputStream = file.getInputStream()) {
            blobClient.upload(inputStream, file.getSize(), true);
        }

        ScriptFileEntity entity = new ScriptFileEntity();
        entity.setFilename(file.getOriginalFilename());
        entity.setStorageKey(storageKey);
        entity.setContentType(file.getContentType());
        entity.setSizeBytes(file.getSize());
        entity.setUploadedBy(uploadedBy);
        return scriptFileRepository.save(entity);
    }

}*/
package com.ZioSet_WorkerConfiguration.service;

import com.ZioSet_WorkerConfiguration.model.ScriptFileEntity;
import com.ZioSet_WorkerConfiguration.repo.ScriptFileRepository;
import com.azure.storage.blob.*;
        import com.azure.storage.blob.models.BlobHttpHeaders;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.security.MessageDigest;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ScriptFileService {

    private final ScriptFileRepository scriptFileRepository;

    @Value("${azure.storage.connection-string}")
    private String azureConnectionString;

    @Value("${azure.storage.container-name}")
    private String containerName;  // should be "scripts"

    public ScriptFileEntity uploadFile(MultipartFile file, String uploadedBy) throws Exception {

        // Initialize blob client
        BlobServiceClient serviceClient = new BlobServiceClientBuilder()
                .connectionString(azureConnectionString)
                .buildClient();

        // Get "scripts" container
        BlobContainerClient containerClient = serviceClient.getBlobContainerClient(containerName);

        // Create container if not exists
        if (!containerClient.exists()) {
            containerClient.create();
        }

        // Unique Blob Name
        String storageKey = UUID.randomUUID() + "_" + file.getOriginalFilename();

        // Blob reference
        BlobClient blobClient = containerClient.getBlobClient(storageKey);

        // Upload file
        try (InputStream inputStream = file.getInputStream()) {
            blobClient.upload(inputStream, file.getSize(), true);
        }

        // Set content type
        blobClient.setHttpHeaders(new BlobHttpHeaders().setContentType(file.getContentType()));

        // Compute SHA-512
        String sha512 = computeSHA512(file);

        // Save entity in DB
        ScriptFileEntity entity = new ScriptFileEntity();
        entity.setFilename(file.getOriginalFilename());
        entity.setStorageKey(storageKey);
        entity.setContentType(file.getContentType());
        entity.setSizeBytes(file.getSize());
        entity.setUploadedBy(uploadedBy);
        entity.setSha512(sha512);

        return scriptFileRepository.save(entity);
    }

    private String computeSHA512(MultipartFile file) throws Exception {
        MessageDigest digest = MessageDigest.getInstance("SHA-512");
        byte[] hash = digest.digest(file.getBytes());

        StringBuilder hex = new StringBuilder();
        for (byte b : hash) hex.append(String.format("%02x", b));
        return hex.toString();
    }

    public String getBlobUrl(String storageKey) {
        BlobServiceClient serviceClient = new BlobServiceClientBuilder()
                .connectionString(azureConnectionString)
                .buildClient();

        BlobContainerClient containerClient = serviceClient.getBlobContainerClient(containerName);
        BlobClient blobClient = containerClient.getBlobClient(storageKey);

        return blobClient.getBlobUrl();
    }


   /* public ScriptFileEntity uploadFileLocally(MultipartFile file, String uploadedBy) throws Exception {
        // Create local folder if not exists
        String uploadDir = "uploads/";
        java.nio.file.Path uploadPath = java.nio.file.Paths.get(uploadDir);
        if (!java.nio.file.Files.exists(uploadPath)) {
            java.nio.file.Files.createDirectories(uploadPath);
        }

        // Unique filename
        String storageKey = UUID.randomUUID() + "_" + file.getOriginalFilename();

        // Target file path
        java.nio.file.Path filePath = uploadPath.resolve(storageKey);

        // Save file to local directory
        try (InputStream inputStream = file.getInputStream()) {
            java.nio.file.Files.copy(inputStream, filePath);
        }

        // Save DB entity
        ScriptFileEntity entity = new ScriptFileEntity();
        entity.setFilename(file.getOriginalFilename());
        entity.setStorageKey(storageKey);  // local storage key
        entity.setContentType(file.getContentType());
        entity.setSizeBytes(file.getSize());
        entity.setUploadedBy(uploadedBy);

        return scriptFileRepository.save(entity);
    }
*/
}
