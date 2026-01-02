package com.ZioSet_WorkerConfiguration.rolepermission.repository;

import com.ZioSet_WorkerConfiguration.rolepermission.model.RolePermissionAction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface RolePermissionActionRepo extends JpaRepository<RolePermissionAction,Long> {
    @Query("from RolePermissionAction r where r.permissionsAction.permissionAsactionId=?1 and r.role.roleId=?2")
    Optional<RolePermissionAction> getRolePermissionActionByRoleAndPermission(int paramInt1, int paramInt2);

    @Query("""
        SELECT rpa.permissionsAction.permissionAsactionId
        FROM RolePermissionAction rpa
        WHERE rpa.role.roleId = :roleId
        """)
    Set<Integer> findAssignedActionIdsByRole(@Param("roleId") int roleId);
}
