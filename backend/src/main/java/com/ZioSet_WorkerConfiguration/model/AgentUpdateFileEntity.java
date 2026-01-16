package com.ZioSet_WorkerConfiguration.model;

import com.ZioSet_WorkerConfiguration.enums.AgentUpdateType;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "agent_update_files")
public class AgentUpdateFileEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "agent_update_id", nullable = false)
    @JsonBackReference
    private AgentUpdateEntity agentUpdate;

    @Column(name = "update_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private AgentUpdateType updateType;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "server_directory", nullable = false)
    private String serverDirectory; // seperated  by /

    @Column(name = "local_directory", nullable = false)
    private String localDirectory;


    @Transient
    private String updateTypeLabel;

    public AgentUpdateFileEntity() {
    }

    public AgentUpdateFileEntity(long id, AgentUpdateEntity agentUpdate, AgentUpdateType updateType, String fileName, String serverDirectory, String localDirectory) {
        this.id = id;
        this.agentUpdate = agentUpdate;
        this.updateType = updateType;
        this.fileName = fileName;
        this.serverDirectory = serverDirectory;
        this.localDirectory = localDirectory;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public AgentUpdateEntity getAgentUpdate() {
        return agentUpdate;
    }

    public void setAgentUpdate(AgentUpdateEntity agentUpdate) {
        this.agentUpdate = agentUpdate;
    }

    public AgentUpdateType getUpdateType() {
        return updateType;
    }

    public void setUpdateType(AgentUpdateType updateType) {
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

    public String getUpdateTypeLabel() {
        return updateType.getValue();
    }
}