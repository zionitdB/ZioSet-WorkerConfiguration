package com.ZioSet_WorkerConfiguration.rolepermission.model;


import java.util.Set;


import com.ZioSet_WorkerConfiguration.rolepermission.dto.ActionDto;
import jakarta.persistence.*;

@Entity
@Table(name = "permissions_mst")
public class Permissions {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "permissions_id")
    private int permissionsId;

    @Column(name = "category")
    private String category;

    @Column(name = "permissions_name")
    private String permissionsName;

    @ManyToOne()
    @JoinColumn(name = "module_id", nullable = false)
    private ModulePermission module;

    @Column(name = "navigation_url")
    private String navigationUrl;

    @Column(name = "active")
    private int active;

    @Transient
    private boolean selected;

    @Transient
    private Set<ActionDto> actions;


    public ModulePermission getModule() {
        return module;
    }

    public void setModule(ModulePermission module) {
        this.module = module;
    }

    public int getPermissionsId() {
        return this.permissionsId;
    }

    public void setPermissionsId(int permissionsId) {
        this.permissionsId = permissionsId;
    }

    public String getPermissionsName() {
        return this.permissionsName;
    }

    public void setPermissionsName(String permissionsName) {
        this.permissionsName = permissionsName;
    }

    public int getActive() {
        return this.active;
    }

    public void setActive(int active) {
        this.active = active;
    }

    public String getCategory() {
        return this.category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public boolean isSelected() {
        return this.selected;
    }

    public void setSelected(boolean selected) {
        this.selected = selected;
    }

    public Set<ActionDto> getActions() {
        return this.actions;
    }

    public void setActions(Set<ActionDto> actions) {
        this.actions = actions;
    }

    public String getNavigationUrl() {
        return navigationUrl;
    }

    public void setNavigationUrl(String navigationUrl) {
        this.navigationUrl = navigationUrl;
    }


}