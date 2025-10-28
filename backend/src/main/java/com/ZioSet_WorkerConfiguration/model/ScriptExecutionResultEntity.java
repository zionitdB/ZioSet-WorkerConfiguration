package com.ZioSet_WorkerConfiguration.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import jakarta.persistence.*;

import java.time.Instant;

@Data
@Entity
@Table(name = "script_execution_results")
public class ScriptExecutionResultEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "run_uuid", nullable = false)
    private String runUuid;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "script_id")
    private ScriptEntity script;

    @Column(name = "system_serial_number")
    private String systemSerialNumber;

    private Instant startedAt;
    private Instant finishedAt;
    private Integer returnCode;

    @Lob
    private String stdout;

    @Lob
    private String stderr;

    @Column(nullable = false, updatable = false)
    private Instant receivedAt = Instant.now();
}
