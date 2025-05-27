package com.ZioSet_WorkerConfiguration.dto;

import java.util.List;

public class MultipleSerialNumberDto {
    public MultipleSerialNumberDto(String deletedById, List<String> serialNumbers) {
        this.deletedById = deletedById;
        this.serialNumbers = serialNumbers;
    }

    private List<String> serialNumbers;

    public String getDeletedById() {
        return deletedById;
    }

    public List<String> getSerialNumbers() {
        return serialNumbers;
    }

    private String deletedById;

}
