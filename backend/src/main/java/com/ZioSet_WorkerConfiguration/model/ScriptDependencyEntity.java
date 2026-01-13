package com.ZioSet_WorkerConfiguration.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;

@Data
@Entity
@Table(name = "script_dependencies")
public class ScriptDependencyEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "script_template_id", nullable = false)
    private ScriptTemplateEntity template;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "script_id", nullable = false)
    private ScriptEntity script;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "script_file_id", nullable = false)
    private ScriptFileEntity scriptFile;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();
}
