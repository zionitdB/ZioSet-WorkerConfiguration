package com.ZioSet_WorkerConfiguration.dto;

import lombok.Data;
import java.time.Instant;

@Data
public class ScriptFileDTO {
    private Long id;
    private String filename;
    private String storageKey;
    private String contentType;
    private Long sizeBytes;
    private String sha512;
    private String uploadedBy;
    private Instant uploadedAt;
}
