package com.ZioSet_WorkerConfiguration.rolepermission.model;


import jakarta.persistence.*;

@Entity
@Table(name = "role_permissions")
public class RolePermission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "role_permissions_id")
    private int rolePermissionsId;

    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;

    @ManyToOne
    @JoinColumn(name = "permissions_id")
    private Permissions permissions;

    public int getRolePermissionsId() {
        return this.rolePermissionsId;
    }

    public void setRolePermissionsId(int rolePermissionsId) {
        this.rolePermissionsId = rolePermissionsId;
    }

    public Role getRole() {
        return this.role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Permissions getPermissions() {
        return this.permissions;
    }

    public void setPermissions(Permissions permissions) {
        this.permissions = permissions;
    }
}
