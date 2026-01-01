package com.ZioSet_WorkerConfiguration.rolepermission.dto;

import lombok.Data;

@Data
public class SaveRolePermissionDTO {
    private int roleId;

    private int permissionId;

    private boolean selected;

    private String actionName;
}
