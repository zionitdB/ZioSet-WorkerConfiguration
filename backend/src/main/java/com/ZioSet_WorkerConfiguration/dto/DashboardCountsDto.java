package com.ZioSet_WorkerConfiguration.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardCountsDto {
    private long success;
    private long failed;
    private long pending;
    private long total;
}