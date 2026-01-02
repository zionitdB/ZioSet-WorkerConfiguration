package com.ZioSet_WorkerConfiguration.rolepermission.service;


import com.ZioSet_WorkerConfiguration.rolepermission.model.*;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface AccessService {
        Optional<Permissions> getPermissionsByName(String paramString);

        void addPermission(Permissions paramPermissions);

        Optional<Permissions> getPermissionsByNameAndCategoryAndModuleId(String paramString1, String paramString2, Integer moduleId);

        List<Permissions> getPermissionsByModuleNameAndCategory(String paramString1, String paramString2);

        List<Permissions> getPermissionsByLimit(int paramInt1, int paramInt2);

        List<Permissions> getPermissionsByLimitAndSearch(int paramInt1, int paramInt2, String paramString);

        int getPermissionsCount();

        int getPermissionsCountBySearch(String paramString);

        void deletePermission(Permissions paramPermissions);

        List<Permissions> getAllPermission();

        Optional<RolePermission> getRolePermissionByRoleAndPermission(int paramInt1, int paramInt2);

        void saveRolePermission(RolePermission paramRolePermission);

        void deleteRolePermission(RolePermission paramRolePermission);

        List<RolePermission> getPermissionsByRole(int paramInt);

        Optional<Permissions> getPermissionsByNameAndCategory(String paramString1, String paramString2);

        Optional<Role> getRoleByName(String paramString);

        void addRole(Role paramRole);

        void savePermissionAction(PermissionAction paramPermissionAction);

        void deleteAllPermissionAction(List<PermissionAction> paramList);

        List<Permissions> getPermissionByCategory(String paramString);

        int getPermissionsCountByCategory(String paramString);

        int getPermissionsMasterCategory(String paramString);

        List<RolePermission> getPermissionsByRoleAndCategory(int paramInt, String paramString);

        List<Permissions> getPermissionsByCategory(String paramString);

        List<PermissionAction> getPermissionActionBYPermissionId(int paramInt);

        List<Permissions> findAllActivePermissions();

        List<PermissionAction> findByPermissionsId(int permissionsId);

        Set<Integer> findAssignedActionIdsByRole(int roleId);

        Set<Integer> findPermissionIdsByRole(int roleId);


        List<Role> getAllRoles();

        Role getRoleById(int paramInt);

        Role updateRoleById(Long id, Role updatedRoleData);
        void deleteRole(Long id);



        Permissions getPermissionsById(int paramInt);

        Optional<PermissionAction> getPermissionActionBYPermissionIdAndActionName(int paramInt, String paramString);

        List<Permissions> getAllPermissions();

        List<String> findDistinctCategories();
    }