package com.ZioSet_WorkerConfiguration.rolepermission.dto;

import com.ZioSet_WorkerConfiguration.rolepermission.model.Role;
import lombok.Data;

import java.util.List;

@Data
public class RolePermissionDto {
    private Role role;

    List<PermissionDTO> permissions;

    List<PermissionDTO> permissionsMasters;

    List<PermissionDTO> permissionsTransaction;

    List<PermissionDTO> permissionsReport;
}
