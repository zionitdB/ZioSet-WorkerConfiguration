package com.ZioSet_WorkerConfiguration.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import jakarta.persistence.*;

import java.time.Instant;

@Data
@Entity
@Table(name = "script_target_systems")
public class ScriptTargetSystemEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "script_id", nullable = false)
    private ScriptEntity script;

    @Column(name = "system_serial_number", nullable = false)
    private String systemSerialNumber;

    private String hostName;

    @Column(name = "assigned_by", length = 128)
    private String assignedBy;

    @Column(name = "assigned_at", nullable = false, updatable = false)
    private Instant assignedAt = Instant.now();

    @Column(name = "last_run_at")
    private Instant lastRunAt;
}
