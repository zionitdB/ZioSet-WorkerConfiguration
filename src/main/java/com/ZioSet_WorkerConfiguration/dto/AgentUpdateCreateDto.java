package com.ZioSet_WorkerConfiguration.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;
import java.util.List;

public class AgentUpdateCreateDto {
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime targetDateTime;
    private List<AgentUpdateFileCreateDto> files;
    private List<String> systemSerialNumbers;

    public LocalDateTime getTargetDateTime() {
        return targetDateTime;
    }

    public void setTargetDateTime(LocalDateTime targetDateTime) {
        this.targetDateTime = targetDateTime;
    }

    public List<AgentUpdateFileCreateDto> getFiles() {
        return files;
    }

    public void setFiles(List<AgentUpdateFileCreateDto> files) {
        this.files = files;
    }

    public List<String> getSystemSerialNumbers() {
        return systemSerialNumbers;
    }

    public void setSystemSerialNumbers(List<String> systemSerialNumbers) {
        this.systemSerialNumbers = systemSerialNumbers;
    }
}
