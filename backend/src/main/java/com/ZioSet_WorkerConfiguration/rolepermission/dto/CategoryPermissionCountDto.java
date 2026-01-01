package com.ZioSet_WorkerConfiguration.rolepermission.dto;

import lombok.Data;

@Data
public class CategoryPermissionCountDto {
    private int masterCount;

    private int transactionCount;

    private int reportCount;

    private int dashboardCount;
}
