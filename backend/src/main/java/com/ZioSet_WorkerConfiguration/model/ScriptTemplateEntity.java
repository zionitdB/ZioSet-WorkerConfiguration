package com.ZioSet_WorkerConfiguration.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Entity
@Table(name = "script_templates")
@Data
public class ScriptTemplateEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Lob
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "script_type", nullable = false)
    private ScriptType scriptType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "script_file_id")
    @JsonIgnore
    private ScriptFileEntity scriptFile; // For file-based scripts

    @ElementCollection
    @CollectionTable(name = "template_required_params")
    @MapKeyColumn(name = "param_key")
    @Column(name = "description")
    private Map<String, String> requiredParameters;

    @Enumerated(EnumType.STRING)
    private ScheduleType scheduleType;

    // One-to-many relationship with dependencies
    @OneToMany(mappedBy = "template", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ScriptDependencyEntity> dependencies = new HashSet<>();

    @Column(name = "target_platforms_csv")
    private String targetPlatformsCsv;

    @Column(nullable = false)
    private Integer version = 1;

    @Column(nullable = false)
    private Boolean isActive = true;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

}
