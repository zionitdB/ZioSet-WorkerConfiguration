package com.ZioSet_WorkerConfiguration.rolepermission.model;


import com.ZioSet_WorkerConfiguration.model.UserInfo;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "permission_request")
@Data
public class PermissionRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;
    @ManyToOne
    @JoinColumn(name = "permission_id")
    private Permissions permissions;
    @ManyToOne
    @JoinColumn(name = "permission_action_id")
    private PermissionAction permissionAction;


    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserInfo userInfo;


    @Column(name = "remark")
    private String remark;

    @Column(name = "approved")
    private int approved;

}