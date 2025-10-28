package com.ZioSet_WorkerConfiguration.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;

@Data
@Entity
@Table(name = "script_files")
public class ScriptFileEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 512, nullable = false)
    private String filename;

    @Column(name = "storage_key", length = 1024, nullable = false, unique = true)
    private String storageKey;

    @Column(length = 128)
    private String contentType;

    @Column(name = "size_bytes")
    private Long sizeBytes;

    @Column(length = 128)
    private String sha512;

    @Column(length = 128)
    private String uploadedBy;

    @Column(nullable = false, updatable = false)
    private Instant uploadedAt = Instant.now();
}
