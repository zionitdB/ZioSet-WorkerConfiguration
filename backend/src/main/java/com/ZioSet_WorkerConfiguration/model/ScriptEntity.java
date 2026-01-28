package com.ZioSet_WorkerConfiguration.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Data
@NoArgsConstructor
@Entity
@Table(name = "scripts")
public class ScriptEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "template_id")
    private ScriptTemplateEntity template;

    @Lob
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "script_type")
    private ScriptType scriptType;

    @Lob
    private String scriptText; // For inline scripts

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "script_file_id")
    @JsonIgnore
    private ScriptFileEntity scriptFile; // For file-based scripts

    @ElementCollection
    @CollectionTable(
            name = "script_arguments",
            joinColumns = @JoinColumn(name = "script_id")
    )
    @MapKeyColumn(name = "arg_key")
    @Column(name = "arg_value")
    private Map<String, String> scriptArgument;

    // One-to-many relationship with dependencies
    @OneToMany(mappedBy = "script", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ScriptDependencyEntity> dependencies = new HashSet<>();

    // One-to-many relationship with target systems
    @OneToMany(mappedBy = "script", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ScriptTargetSystemEntity> targets = new HashSet<>();

    // One-to-many relationship with execution results
    @OneToMany(mappedBy = "script", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ScriptExecutionResultEntity> executionResults = new HashSet<>();

    @Column(name = "target_platforms_csv")
    private String targetPlatformsCsv;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(nullable = false)
    private Instant updatedAt = Instant.now();

    @Column(nullable = false)
    private Boolean isActive = true;

    @Enumerated(EnumType.STRING)
    private ScheduleType scheduleType;

    private Instant startDateTime;          // for all types

    private Long repeatEverySeconds;    // for INTERVAL

    @Column(name = "week_days")
    private String weekDaysCsv;        // "MON,FRI"

    private Integer monthDay;          // e.g., 2, 15, 31

    private LocalTime timeOfDay;

    private Long addedBy;

    private String hostName;

    @PreUpdate
    public void setUpdatedAt() {
        this.updatedAt = Instant.now();
    }
}
