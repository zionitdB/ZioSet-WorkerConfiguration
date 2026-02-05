package com.ZioSet_WorkerConfiguration.dto;

import lombok.Data;

@Data
public class AssetSyncDto {

    private long id;
    private String assetId;
    private String serialNo;
    private String computerName;
    private String domainName;
    private String employeeNo;
    private String employeeName;
    private String systemIp;
    private String assetType;
    private String model;
    private String projectName;
    private String projectId;
    private String lastActive;

    private LocationDto location;
}
