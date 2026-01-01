package com.ZioSet_WorkerConfiguration.rolepermission.dto;

import lombok.Data;

@Data
public class PermissionDTO {
    private String permissionName;

    private String category;

    private boolean permissionAvailable;

    private boolean editTab;
}
