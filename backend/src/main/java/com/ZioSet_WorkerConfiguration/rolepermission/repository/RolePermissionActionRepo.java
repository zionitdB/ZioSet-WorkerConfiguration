package com.ZioSet_WorkerConfiguration.rolepermission.repository;

import com.ZioSet_WorkerConfiguration.rolepermission.model.RolePermissionAction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface RolePermissionActionRepo extends JpaRepository<RolePermissionAction,Long> {
    @Query("from RolePermissionAction r where r.permissionsAction.permissionAsactionId=?1 and r.role.roleId=?2")
    Optional<RolePermissionAction> getRolePermissionActionByRoleAndPermission(int paramInt1, int paramInt2);
}
