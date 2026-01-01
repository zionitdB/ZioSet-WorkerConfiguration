package com.ZioSet_WorkerConfiguration.rolepermission.repository;

import com.ZioSet_WorkerConfiguration.rolepermission.model.PermissionRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface PermissionRequestRepo extends JpaRepository<PermissionRequest, Integer> {
    @Query("From PermissionRequest p where p.permissions.permissionsId=?1 and p.permissionAction.permissionAsactionId=?2 and p.userInfo.userId=?3")
    Optional<PermissionRequest> getPermisionRequestByPermisionIdUserANdAction(int permissionsId,
                                                                              int permissionAsactionId, int userId);

    @Query("From PermissionRequest p where p.approved=0")
    List<PermissionRequest> getAllPermissionRequests();


    @Query("From PermissionRequest p where p.approved=1 and p.userInfo.userId=?1")
    List<PermissionRequest> getApprovedPermissionRequestByUser(int userid);

    @Query("From PermissionRequest p where p.approved=1 and p.userInfo.userId=?1 and p.permissions.permissionsId=?2")
    List<PermissionRequest> getApprovedPermissionRequestByUserAndPermission(int userid, int permissionsId);


    @Query("From PermissionRequest p where p.approved=1 and p.userInfo.userId=?1 and p.permissions.permissionsId=?2 and p.permissionAction.actionName=?3  ")
    List<PermissionRequest> getApprovedPermissionRequestByUserPermissionAndAction(int userId, int permissionsId,
                                                                                  String actionName);

}