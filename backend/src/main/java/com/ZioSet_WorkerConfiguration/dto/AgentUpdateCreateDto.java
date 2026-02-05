package com.ZioSet_WorkerConfiguration.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class AgentUpdateCreateDto {
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime targetDateTime;
    private List<AgentUpdateFileCreateDto> files;
    private List<Map<String,String>> serialNoHostName;



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

    public List<Map<String, String>> getSerialNoHostName() {
        return serialNoHostName;
    }

    public void setSerialNoHostName(List<Map<String, String>> serialNoHostName) {
        this.serialNoHostName = serialNoHostName;
    }
}
