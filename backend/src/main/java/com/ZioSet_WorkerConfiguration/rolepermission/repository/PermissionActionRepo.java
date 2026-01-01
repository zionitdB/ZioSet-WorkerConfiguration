package com.ZioSet_WorkerConfiguration.rolepermission.repository;

import com.ZioSet_WorkerConfiguration.rolepermission.model.PermissionAction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface PermissionActionRepo extends JpaRepository<PermissionAction, Integer> {
    @Query("from PermissionAction where permissions.permissionsId=?1")
    List<PermissionAction> getPermissionActionBYPermissionId(int paramInt);

    @Query("from PermissionAction where permissions.permissionsId=?1 and actionName=?2")
    Optional<PermissionAction> getPermissionActionBYPermissionIdAndActionName(int paramInt, String paramString);

    @Query("from PermissionAction where permissions.permissionsId=?1 and actionName=?2")
    List<PermissionAction>  getPermissionActionBYPermissionIdAndActionName1(int paramInt, String paramString);

}
