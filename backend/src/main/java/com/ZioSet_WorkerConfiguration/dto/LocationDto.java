package com.ZioSet_WorkerConfiguration.dto;

import lombok.Data;

@Data
public class LocationDto {

    private Long locationId;
    private String locationName;
    private String locationCode;
    private String address;
    private Integer minOrderQty;
}

