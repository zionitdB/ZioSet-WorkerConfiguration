package com.ZioSet_WorkerConfiguration.rolepermission.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "role_permissions_action")
@Data
public class RolePermissionAction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "role_permissions_action_id")
    private int rolePermissionActionId;

    @ManyToOne
    @JoinColumn(name = "permissions_action_id")
    private PermissionAction permissionsAction;

    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;
}
