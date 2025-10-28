package com.ZioSet_WorkerConfiguration.service;

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
}
