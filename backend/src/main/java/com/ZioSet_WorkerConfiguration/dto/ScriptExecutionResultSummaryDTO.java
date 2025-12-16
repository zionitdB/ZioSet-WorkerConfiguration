package com.ZioSet_WorkerConfiguration.dto;

import lombok.Data;

import java.time.Instant;

@Data
public class ScriptExecutionResultSummaryDTO {
    private Long id;
    private String runUuid;
    private Long scriptId;
    private String scriptName;
    private String systemSerialNumber;
    private Instant startedAt;
    private Instant finishedAt;
    private Integer returnCode;
    private String stdout;
    private String stderr;
}
