package com.ZioSet_WorkerConfiguration.dto;

import java.time.Instant;

public record ScriptExecutionMetricsDTO(
        Long scriptId,
        Double averageExecutionTimeSeconds,
        Instant lastExecutionTime,
        Double successRate
) {}

