package com.ZioSet_WorkerConfiguration.model;

import jakarta.persistence.*;

@Entity
@Table(name = "agent_update_systems")
public class AgentUpdateSystemsEntity {
    @Id
    @GeneratedValue
    private long id;

    @ManyToOne
    @JoinColumn(name = "agent_update_id", nullable = false)
    private AgentUpdateEntity agentUpdate;

    @Column(name = "system_serial_number", nullable = false)
    private String systemSerialNumber;

    @Column(name = "is_updated")
    private boolean isUpdated;

    @Column(name = "updated_at")
    private String updatedAt;


    public AgentUpdateSystemsEntity() {
    }

    public AgentUpdateSystemsEntity(AgentUpdateEntity agentUpdate, String systemSerialNumber) {
        this.agentUpdate = agentUpdate;
        this.systemSerialNumber = systemSerialNumber;
    }

    public AgentUpdateSystemsEntity(long id, AgentUpdateEntity agentUpdate, String systemSerialNumber, boolean isUpdated, String updatedAt) {
        this.id = id;
        this.agentUpdate = agentUpdate;
        this.systemSerialNumber = systemSerialNumber;
        this.isUpdated = isUpdated;
        this.updatedAt = updatedAt;
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
