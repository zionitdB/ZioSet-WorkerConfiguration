package com.ZioSet_WorkerConfiguration.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "deleted_serial_numbers")
public class DeletedSystems {


    @Id
    @GeneratedValue
    private Long id;

    @Column(name = "system_serial_number", nullable = false)
    private String systemSerialNumber;
    @Enumerated(EnumType.STRING)
    private SystemOs systemOs;
    @Column(name = "deleted_by_id", nullable = false)
    private String deletedById;
    @CreationTimestamp
    private LocalDateTime deletedAt;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSystemSerialNumber() {
        return systemSerialNumber;
    }

    public void setSystemSerialNumber(String systemSerialNumber) {
        this.systemSerialNumber = systemSerialNumber;
    }

    public SystemOs getSystemOs() {
        return systemOs;
    }

    public void setSystemOs(SystemOs systemOs) {
        this.systemOs = systemOs;
    }

    public String getDeletedById() {
        return deletedById;
    }

    public void setDeletedById(String deletedById) {
        this.deletedById = deletedById;
    }

    public LocalDateTime getDeletedAt() {
        return deletedAt;
    }

    public void setDeletedAt(LocalDateTime deletedAt) {
        this.deletedAt = deletedAt;
    }

    public DeletedSystems(Long id, String systemSerialNumber, SystemOs systemOs, String deletedById, LocalDateTime deletedAt) {
        this.id = id;
        this.systemSerialNumber = systemSerialNumber;
        this.systemOs = systemOs;
        this.deletedById = deletedById;
        this.deletedAt = deletedAt;
    }

    public DeletedSystems() {
    }
}

