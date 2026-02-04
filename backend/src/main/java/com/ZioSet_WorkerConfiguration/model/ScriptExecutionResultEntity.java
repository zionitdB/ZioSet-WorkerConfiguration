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

    @Column(name = "started_at")
    private Instant startedAt;
    @Column(name = "finished_at")
    private Instant finishedAt;
    @Column(name = "return_code")
    private Integer returnCode;

    @Lob
    @Column(name = "stdout", columnDefinition = "TEXT")
    private String stdout;

    @Lob
    @Column(name = "stderr", columnDefinition = "TEXT")
    private String stderr;

    @Column(name = "received_at", nullable = false, updatable = false)
    private Instant receivedAt = Instant.now();

    @Column(name = "host_name")
    private String hostName;
}
