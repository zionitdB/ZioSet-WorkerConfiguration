package com.ZioSet_WorkerConfiguration.dto;

public class AgentUpdateFileCreateDto {
    private String updateType;
    private String fileName;
    private String serverDirectory;
    private String localDirectory;

    public AgentUpdateFileCreateDto() {
    }

    public AgentUpdateFileCreateDto(String updateType, String fileName, String serverDirectory, String localDirectory) {
        this.updateType = updateType;
        this.fileName = fileName;
        this.serverDirectory = serverDirectory;
        this.localDirectory = localDirectory;
    }

    public String getUpdateType() {
        return updateType;
    }

    public void setUpdateType(String updateType) {
        this.updateType = updateType;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getServerDirectory() {
        return serverDirectory;
    }

    public void setServerDirectory(String serverDirectory) {
        this.serverDirectory = serverDirectory;
    }

    public String getLocalDirectory() {
        return localDirectory;
    }

    public void setLocalDirectory(String localDirectory) {
        this.localDirectory = localDirectory;
    }
}
