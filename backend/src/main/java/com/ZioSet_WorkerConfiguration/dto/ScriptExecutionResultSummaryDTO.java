package com.ZioSet_WorkerConfiguration.dto;

import com.ZioSet_WorkerConfiguration.parsing.ParsedExecutionResult;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ScriptExecutionResultSummaryDTO {
    private Long id;
    private String runUuid;
    private Long scriptId;
    private String scriptName;
    private String systemSerialNumber;
    private Instant startedAt;
    private Instant finishedAt;
    private Integer returnCode;
    private String status;
    private String stdout;
    private String stderr;
    private String hostName;
    private ParsedExecutionResult parsedData;
}
