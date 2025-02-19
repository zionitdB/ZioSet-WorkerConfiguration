package com.ZioSet_WorkerConfiguration.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "installed_systems")
public class MACInstalledSystemEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "uuid", nullable = false, unique = true)
    private String uuid;

    @Column(name = "system_serial_no", unique = true, nullable = false)
    private String systemSerialNo;

    @Column(name = "is_installed")
    private boolean installed;

    @Column(name = "installed_at")
    private LocalDateTime installedAt;

    @Column(name = "install_req_at")
    private LocalDateTime installReqAt;

    @Column(name = "installtion_response", columnDefinition = "LONGTEXT")
    private String installationResponse;


    public MACInstalledSystemEntity() {
    }

    public MACInstalledSystemEntity(long id, String uuid, String systemSerialNo, boolean installed, LocalDateTime installedAt, LocalDateTime installReqAt, String installationResponse) {
        this.id = id;
        this.uuid = uuid;
        this.systemSerialNo = systemSerialNo;
        this.installed = installed;
        this.installedAt = installedAt;
        this.installReqAt = installReqAt;
        this.installationResponse = installationResponse;
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

    public String getSystemSerialNo() {
        return systemSerialNo;
    }

    public void setSystemSerialNo(String systemSerialNo) {
        this.systemSerialNo = systemSerialNo;
    }

    public boolean isInstalled() {
        return installed;
    }

    public void setInstalled(boolean installed) {
        this.installed = installed;
    }

    public LocalDateTime getInstalledAt() {
        return installedAt;
    }

    public void setInstalledAt(LocalDateTime installedAt) {
        this.installedAt = installedAt;
    }

    public LocalDateTime getInstallReqAt() {
        return installReqAt;
    }

    public void setInstallReqAt(LocalDateTime installReqAt) {
        this.installReqAt = installReqAt;
    }

    public String getInstallationResponse() {
        return installationResponse;
    }

    public void setInstallationResponse(String installationResponse) {
        this.installationResponse = installationResponse;
    }
}
