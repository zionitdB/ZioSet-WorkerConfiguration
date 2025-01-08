package com.ZioSet_WorkerConfiguration.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "installed_systems")
public class InstalledSystemEntity {
    @Id
    @GeneratedValue
    private long id;

    @Column(name = "uuid", nullable = false, unique = true)
    private String uuid;

    @Column(name = "system_serial_no", unique = true, nullable = false)
    private String systemSerialNo;

    @Column(name = "is_installed")
    private boolean installed;

    @Column(name = "installed_at")
    private LocalDateTime installedAt;
}
