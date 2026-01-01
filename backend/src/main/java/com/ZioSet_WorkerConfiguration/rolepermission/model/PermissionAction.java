package com.ZioSet_WorkerConfiguration.rolepermission.model;


import jakarta.persistence.*;

@Entity
@Table(name = "permissions_action_mst")
public class PermissionAction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "permissions_action_id")
    private int permissionAsactionId;

    @ManyToOne
    @JoinColumn(name = "permissions_id")
    private Permissions permissions;

    @Column(name = "action_name")
    private String actionName;

    @Column(name = "is_available")
    private boolean isAvailable;

    public int getPermissionAsactionId() {
        return this.permissionAsactionId;
    }

    public void setPermissionAsactionId(int permissionAsactionId) {
        this.permissionAsactionId = permissionAsactionId;
    }

    public Permissions getPermissions() {
        return this.permissions;
    }

    public void setPermissions(Permissions permissions) {
        this.permissions = permissions;
    }

    public String getActionName() {
        return this.actionName;
    }

    public void setActionName(String actionName) {
        this.actionName = actionName;
    }

    public boolean isAvailable() {
        return this.isAvailable;
    }

    public void setAvailable(boolean isAvailable) {
        this.isAvailable = isAvailable;
    }

    @Override
    public String toString() {
        return "PermissionAction [permissionAsactionId=" + permissionAsactionId + ", permissions=" + permissions
                + ", actionName=" + actionName + ", isAvailable=" + isAvailable + "]";
    }
}


