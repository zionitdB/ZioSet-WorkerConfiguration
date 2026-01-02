package com.ZioSet_WorkerConfiguration.rolepermission.repository;

import com.ZioSet_WorkerConfiguration.rolepermission.model.RolePermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface RolePermissionRepo extends JpaRepository<RolePermission, Integer> {
    @Query("from  RolePermission p where p.role.roleId=?1 and p.permissions.permissionsId=?2")
    Optional<RolePermission> getRolePermissionByRoleAndPermission(int paramInt1, int paramInt2);

    @Query("from  RolePermission p where p.role.roleId=?1")
    List<RolePermission> getPermissionsByRole(int paramInt);

    @Query("select count(p) from  RolePermission p where  p.permissions.category=?1")
    int getPermissionsCountByCategory(String paramString);

    @Query(" from  RolePermission p where p.role.roleId=?1  and  p.permissions.category=?2")
    List<RolePermission> getPermissionsByRoleAndCatrgory(int paramInt, String paramString);

    @Query("""
        SELECT rp.permissions.permissionsId
        FROM RolePermission rp
        WHERE rp.role.roleId = :roleId
        """)
    Set<Integer> findPermissionIdsByRole(@Param("roleId") int roleId);
}

