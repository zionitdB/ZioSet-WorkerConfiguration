package com.ZioSet_WorkerConfiguration.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;

@Entity
@Table(name = "unregistered_assets")
public class UnRegisteredAssets {
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "system_serial_number" ,unique = true, nullable = false)
    private String systemSerialNumber;

    @Column(name = "computer_name")
    private String computerName;

    @Column(name = "operating_system")
    private String operatingSystem;

    @CreationTimestamp
    @Column(name = "added_date_time")
    private Date addedDateTime;

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

    public String getComputerName() {
        return computerName;
    }

    public void setComputerName(String computerName) {
        this.computerName = computerName;
    }

    public String getOperatingSystem() {
        return operatingSystem;
    }

    public void setOperatingSystem(String operatingSystem) {
        this.operatingSystem = operatingSystem;
    }

    public Date getAddedDateTime() {
        return addedDateTime;
    }

    public void setAddedDateTime(Date addedDateTime) {
        this.addedDateTime = addedDateTime;
    }

    public UnRegisteredAssets() {

    }

    public UnRegisteredAssets(Long id, String systemSerialNumber, String computerName, String operatingSystem, Date addedDateTime) {
        this.id = id;
        this.systemSerialNumber = systemSerialNumber;
        this.computerName = computerName;
        this.operatingSystem = operatingSystem;
        this.addedDateTime = addedDateTime;
    }
}
