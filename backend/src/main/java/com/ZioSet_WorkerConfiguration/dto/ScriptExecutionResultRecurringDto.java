package com.ZioSet_WorkerConfiguration.dto;

import java.time.Instant;

public record ScriptExecutionResultRecurringDto(
         Long scriptId,
         String scriptName,
         String systemSerialNumber,
         String hostName,
         String status,
         Instant finishedAt
) {
}
