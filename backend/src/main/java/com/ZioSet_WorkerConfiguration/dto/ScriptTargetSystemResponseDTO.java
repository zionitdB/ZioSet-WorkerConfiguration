package com.ZioSet_WorkerConfiguration.dto;

import java.time.Instant;

public record ScriptTargetSystemResponseDTO (
    Long id,
    String systemSerialNumber,
    String assignedBy,
    Instant assignedAt,
    Instant lastRunAt,
    Long scriptId,
    String hostName,
    String scriptName
) {}
