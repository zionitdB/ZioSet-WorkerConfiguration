package com.ZioSet_WorkerConfiguration.rolepermission.dto;

import com.ZioSet_WorkerConfiguration.rolepermission.model.Permissions;
import lombok.Data;

import java.util.List;

@Data
public class PermissionsDTO {

    private List<Permissions> masterPermission;

    private List<Permissions> transactionPermission;

    private List<Permissions> reportPermission;

    private List<Permissions> dashboardPermission;
    private List<Permissions> configurationPermission;

    private List<Permissions> hrPermission;

}
