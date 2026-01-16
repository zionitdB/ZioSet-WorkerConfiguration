package com.ZioSet_WorkerConfiguration.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "agent_updates")
public class AgentUpdateEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "uuid", nullable = false, unique = true)
    private String uuid;

    @OneToMany(mappedBy = "agentUpdate", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<AgentUpdateFileEntity> files;

    @OneToMany(mappedBy = "agentUpdate", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<AgentUpdateSystemsEntity> targetSystems;

    @Column(name = "target_date_time", nullable = false)
    private LocalDateTime targetDateTime;

    @Column(name = "created_at")
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Transient
    private long targetSystemsCount;

    public AgentUpdateEntity() {
    }

    public AgentUpdateEntity(String uuid, List<AgentUpdateFileEntity> files, List<AgentUpdateSystemsEntity> targetSystems, LocalDateTime targetDateTime) {
        this.uuid = uuid;
        this.files = files;
        this.targetSystems = targetSystems;
        this.targetDateTime = targetDateTime;
    }

    public AgentUpdateEntity(long id, String uuid, List<AgentUpdateFileEntity> files, List<AgentUpdateSystemsEntity> targetSystems, LocalDateTime targetDateTime, LocalDateTime createdAt) {
        this.id = id;
        this.uuid = uuid;
        this.files = files;
        this.targetSystems = targetSystems;
        this.targetDateTime = targetDateTime;
        this.createdAt = createdAt;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public List<AgentUpdateFileEntity> getFiles() {
        return files;
    }

    public void setFiles(List<AgentUpdateFileEntity> files) {
        this.files = files;
    }

    public List<AgentUpdateSystemsEntity> getTargetSystems() {
        return targetSystems;
    }

    public void setTargetSystems(List<AgentUpdateSystemsEntity> targetSystems) {
        this.targetSystems = targetSystems;
    }

    public LocalDateTime getTargetDateTime() {
        return targetDateTime;
    }

    public void setTargetDateTime(LocalDateTime targetDateTime) {
        this.targetDateTime = targetDateTime;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public long getTargetSystemsCount() {
        return targetSystemsCount;
    }

    public void setTargetSystemsCount(long targetSystemsCount) {
        this.targetSystemsCount = targetSystemsCount;
    }
}


