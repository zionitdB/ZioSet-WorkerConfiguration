package com.ZioSet_WorkerConfiguration.dto;

import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.Instant;

@Data
public class ExecutionResultFilterDTO {
    private String serialNumberOrHostName;
    private Long scriptId;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private Instant finishedAfter;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private Instant finishedBefore;

}
