package com.ZioSet_WorkerConfiguration.dto;

import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.Instant;

@Data
public class ExecutionResultFilterDTO {
    private String serialNumber;
    private Long scriptId;
    private String hostName;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private Instant finishedAfter;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private Instant finishedBefore;
}
