package com.ZioSet_WorkerConfiguration.dto;

import com.ZioSet_WorkerConfiguration.enums.AgentUpdateCategory;
import com.ZioSet_WorkerConfiguration.model.AgentUpdateEntity;
import com.ZioSet_WorkerConfiguration.model.AgentUpdateSystemsEntity;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

public class AddAgentUpdateDTO {

    private String fileName;
    private String downloadEndpoint;
    private boolean directoryAction;
    private String directoryName;
    private AgentUpdateCategory updateCategory;
    private Set<String> stopProcesses;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime targetDateTime;
    private List<String> systemSerialNumbers;

    // Default constructor
    public AddAgentUpdateDTO() {}

    // Getters and Setters
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getDownloadEndpoint() { return downloadEndpoint; }
    public void setDownloadEndpoint(String downloadEndpoint) { this.downloadEndpoint = downloadEndpoint; }

    public boolean isDirectoryAction() { return directoryAction; }
    public void setDirectoryAction(boolean directoryAction) { this.directoryAction = directoryAction; }

    public String getDirectoryName() { return directoryName; }
    public void setDirectoryName(String directoryName) { this.directoryName = directoryName; }

    public AgentUpdateCategory getUpdateCategory() { return updateCategory; }
    public void setUpdateCategory(AgentUpdateCategory updateCategory) { this.updateCategory = updateCategory; }

    public Set<String> getStopProcesses() { return stopProcesses; }
    public void setStopProcesses(Set<String> stopProcesses) { this.stopProcesses = stopProcesses; }

    public LocalDateTime getTargetDateTime() { return targetDateTime; }
    public void setTargetDateTime(LocalDateTime targetDateTime) { this.targetDateTime = targetDateTime; }

    public List<String> getSystemSerialNumbers() { return systemSerialNumbers; }
    public void setSystemSerialNumbers(List<String> systemSerialNumbers) { this.systemSerialNumbers = systemSerialNumbers; }

    public AgentUpdateEntity toAgentUpdateEntity(String uuid) {
        return new AgentUpdateEntity(uuid, fileName, downloadEndpoint, directoryAction, directoryName, updateCategory, stopProcesses, targetDateTime);
    }

    public List<AgentUpdateSystemsEntity> toAgentUpdateSystemsEntities(AgentUpdateEntity agentUpdateEntity) {
        return systemSerialNumbers.stream()
                .map(serialNumber -> new AgentUpdateSystemsEntity(agentUpdateEntity, serialNumber))
                .toList();
    }
}
