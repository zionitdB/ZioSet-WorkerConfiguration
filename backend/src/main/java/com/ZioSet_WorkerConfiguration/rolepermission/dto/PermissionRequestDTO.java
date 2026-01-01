package com.ZioSet_WorkerConfiguration.rolepermission.dto;

import com.ZioSet_WorkerConfiguration.rolepermission.model.PermissionAction;
import lombok.Data;

import java.util.List;

@Data
public class PermissionRequestDTO {
    private String category;
    private int permissionsId;
    private List<PermissionAction> actions;
    private String remark;
    private int userId;
}
