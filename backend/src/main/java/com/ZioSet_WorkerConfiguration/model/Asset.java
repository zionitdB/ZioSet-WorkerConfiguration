package com.ZioSet_WorkerConfiguration.model;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "assets")
@Data
public class Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String assetId;
    private String serialNo;
    private String computerName;
    private String domainName;
    private String employeeNo;
    private String employeeName;
    private String systemIp;
    private String lastActive;
    private String syncId;
    private String assetType;
    private String model;
    private String projectName;
    private String projectId;
    private String locationName;

}
