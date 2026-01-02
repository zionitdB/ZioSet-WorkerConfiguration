package com.ZioSet_WorkerConfiguration.rolepermission.model;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class ModulePermission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "module_id")
    private int moduleId;

    @Column(name = "module_name", nullable = false)
    private String moduleName;

    @Column(name = "active")
    private boolean active;

}
