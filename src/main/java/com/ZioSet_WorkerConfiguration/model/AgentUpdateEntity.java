package com.ZioSet_WorkerConfiguration.model;

import com.ZioSet_WorkerConfiguration.enums.AgentUpdateCategory;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "agent_update")
public class AgentUpdateEntity {
    @Id
    @GeneratedValue
    private long id;

    @Column(name = "uuid", nullable = false, unique = true)
    private String uuid;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "download_endpoint", nullable = false)
    private String downloadEndpoint;

    @Column(name = "directory_action")
    private boolean directoryAction;

    @Column(name = "directory_name")
    private String directoryName;

    @Enumerated(value = EnumType.STRING)
    @Column(name = "update_category", nullable = false)
    private AgentUpdateCategory updateCategory;

    @ElementCollection
    private Set<String> stopProcesses;

    @Column(name = "target_date_time", nullable = false)
    private LocalDateTime targetDateTime;

    @Column(name = "created_at")
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Transient
    private long targetSystemsCount;

    @Transient
    private String updateCategoryLabel;

    public AgentUpdateEntity() {
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public AgentUpdateCategory getUpdateCategory() {
        return updateCategory;
    }

    public AgentUpdateEntity(long id, String uuid, String fileName, String downloadEndpoint, boolean directoryAction, String directoryName, AgentUpdateCategory updateCategory, Set<String> stopProcesses, LocalDateTime targetDateTime, LocalDateTime createdAt, long targetSystemsCount, String updateCategoryLabel) {
        this.id = id;
        this.uuid = uuid;
        this.fileName = fileName;
        this.downloadEndpoint = downloadEndpoint;
        this.directoryAction = directoryAction;
        this.directoryName = directoryName;
        this.updateCategory = updateCategory;
        this.stopProcesses = stopProcesses;
        this.targetDateTime = targetDateTime;
        this.createdAt = createdAt;
        this.targetSystemsCount = targetSystemsCount;
        this.updateCategoryLabel = updateCategoryLabel;
    }

    public AgentUpdateEntity(String uuid, String fileName, String downloadEndpoint, boolean directoryAction, String directoryName, AgentUpdateCategory updateCategory, Set<String> stopProcesses, LocalDateTime targetDateTime) {
        this.uuid = uuid;
        this.fileName = fileName;
        this.downloadEndpoint = downloadEndpoint;
        this.directoryAction = directoryAction;
        this.directoryName = directoryName;
        this.updateCategory = updateCategory;
        this.stopProcesses = stopProcesses;
        this.targetDateTime = targetDateTime;
    }

    public void setUpdateCategory(AgentUpdateCategory updateCategory) {
        this.updateCategory = updateCategory;
    }

    public LocalDateTime getTargetDateTime() {
        return targetDateTime;
    }

    public void setTargetDateTime(LocalDateTime targetDateTime) {
        this.targetDateTime = targetDateTime;
    }

    public String getDownloadEndpoint() {
        return downloadEndpoint;
    }

    public void setDownloadEndpoint(String downloadLink) {
        this.downloadEndpoint = downloadLink;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setTargetSystemsCount(long targetSystemsCount) {
        this.targetSystemsCount = targetSystemsCount;
    }

    public long getTargetSystemsCount() {
        return targetSystemsCount;
    }

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public boolean isDirectoryAction() {
        return directoryAction;
    }

    public void setDirectoryAction(boolean directoryAction) {
        this.directoryAction = directoryAction;
    }

    public String getDirectoryName() {
        return directoryName;
    }

    public void setDirectoryName(String directoryName) {
        this.directoryName = directoryName;
    }

    public Set<String> getStopProcesses() {
        return stopProcesses;
    }

    public void setStopProcesses(Set<String> stopProcesses) {
        this.stopProcesses = stopProcesses;
    }

    public String getUpdateCategoryLabel() {
        return updateCategory.getValue();
    }
}