package com.ZioSet_WorkerConfiguration.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "agent_update_systems")
public class AgentUpdateSystemsEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "agent_update_id", nullable = false)
    @JsonBackReference
    private AgentUpdateEntity agentUpdate;

    @Column(name = "system_serial_number", nullable = false)
    private String systemSerialNumber;

    @Column(name = "is_updated")
    private boolean isUpdated;

    @Column(name = "updated_at")
    private String updatedAt;

    @Column(name = "host_name")
    private String hostName;

    public AgentUpdateSystemsEntity() {
    }

    public AgentUpdateSystemsEntity(long id, AgentUpdateEntity agentUpdate, String systemSerialNumber, boolean isUpdated, String updatedAt, String hostName) {
        this.id = id;
        this.agentUpdate = agentUpdate;
        this.systemSerialNumber = systemSerialNumber;
        this.isUpdated = isUpdated;
        this.updatedAt = updatedAt;
        this.hostName = hostName;
    }

    public String getHostName() {
        return hostName;
    }

    public void setHostName(String hostName) {
        this.hostName = hostName;
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

    public void setAgentUpdate(AgentUpdateEntity agentUpdateEntity) {
        this.agentUpdate = agentUpdateEntity;
    }

    public String getSystemSerialNumber() {
        return systemSerialNumber;
    }

    public void setSystemSerialNumber(String systemSerialNumber) {
        this.systemSerialNumber = systemSerialNumber;
    }

    public boolean isUpdated() {
        return isUpdated;
    }

    public void setUpdated(boolean updated) {
        isUpdated = updated;
    }

    public String getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }
}
