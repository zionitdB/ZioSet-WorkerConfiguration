package com.ZioSet_WorkerConfiguration.dto;

import com.ZioSet_WorkerConfiguration.model.ScriptType;
import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
public class ScriptDTO {
    private Long id;
    private String name;
    private String description;
    private ScriptType scriptType;
    private String scriptText;
    private Long scriptFileId;
    private Boolean isActive;
    private Instant createdAt;
    private Instant updatedAt;

    private List<Long> dependencyFileIds;
    private List<String> targetSystemSerials;
}
