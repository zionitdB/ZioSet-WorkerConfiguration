package com.ZioSet_WorkerConfiguration.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.HashSet;
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

    @Lob
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "script_type", nullable = false)
    private ScriptType scriptType;

    @Lob
    private String scriptText; // For inline scripts

    // Many-to-one relationship with ScriptFile (nullable if inline)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "script_file_id")
    private ScriptFileEntity scriptFile; // For file-based scripts

    // One-to-many relationship with dependencies
    @OneToMany(mappedBy = "script", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ScriptDependencyEntity> dependencies = new HashSet<>();

    // One-to-many relationship with target systems
    @OneToMany(mappedBy = "script", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ScriptTargetSystemEntity> targets = new HashSet<>();

    // One-to-many relationship with execution results
    @OneToMany(mappedBy = "script", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ScriptExecutionResultEntity> executionResults = new HashSet<>();

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(nullable = false)
    private Instant updatedAt = Instant.now();

    @Column(nullable = false)
    private Boolean isActive = true;

    @PreUpdate
    public void setUpdatedAt() {
        this.updatedAt = Instant.now();
    }
}

// ScriptType enum
enum ScriptType {
    INLINE_CMD,       // Windows CMD text command
    INLINE_POWERSHELL,// PowerShell text command
    INLINE_BASH,      // Bash text command
    FILE_PS1,         // PowerShell script file (.ps1)
    FILE_BAT,         // Batch file (.bat)
    FILE_SH,          // Shell script file (.sh)
    FILE_EXE          // Executable file (.exe)
}
