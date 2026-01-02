package com.ZioSet_WorkerConfiguration.rolepermission.service;


import com.ZioSet_WorkerConfiguration.rolepermission.model.PermissionAction;
import com.ZioSet_WorkerConfiguration.rolepermission.model.Permissions;
import com.ZioSet_WorkerConfiguration.rolepermission.model.Role;
import com.ZioSet_WorkerConfiguration.rolepermission.model.RolePermission;
import com.ZioSet_WorkerConfiguration.rolepermission.repository.*;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class AccessServiceImpl implements AccessService {

    @Autowired
    PermissionsRepo permissionsRepo;

    @Autowired
    RolePermissionRepo rolPermissionsRepo;

    @Autowired
    RoleRepo roleRepo;

    @Autowired
    PermissionActionRepo permissionActionRepo;

    @Autowired
    RolePermissionActionRepo rolePermissionActionRepo;

    public Optional<Permissions> getPermissionsByName(String permissionsName) {
        return this.permissionsRepo.getPermissionsByName(permissionsName);
    }

    public void addPermission(Permissions permissions) {
        this.permissionsRepo.save(permissions);
    }

    @Override
    public Optional<Permissions> getPermissionsByNameAndCategoryAndModuleId(String param1, String param2, Integer moduleId) {
        return this.permissionsRepo.getPermissionsByNameAndCategoryAndModuleId(param1, param2, moduleId);
    }

    @Override
    public List<Permissions> getPermissionsByModuleNameAndCategory(String paramString1, String paramString2) {
        return this.permissionsRepo.getPermissionsByCategoryAndModuleName(paramString1, paramString2);
    }

    public List<Permissions> getPermissionsByLimit(int page_no, int item_per_page) {
        Pageable pageable= PageRequest.of(page_no,item_per_page);
        return this.permissionsRepo.findAll(pageable).getContent();
    }

    public List<Permissions> getPermissionsByLimitAndSearch(int page_no, int item_per_page, String search) {
        Pageable pageable= PageRequest.of(page_no,item_per_page);
        return this.permissionsRepo.getPermissionsByNameAndPageLim(pageable, search);
    }

    public int getPermissionsCount() {
//        return this.permissionsRepo.getPermissionsCount();
        return (int) permissionsRepo.count();
    }

    public int getPermissionsCountBySearch(String search) {
        return this.permissionsRepo.getPermissionsCountSearch(search);
    }

    public Role updateRoleById(Long id, Role updatedRoleData) {
        return roleRepo.findById(Math.toIntExact(id)).map(existingRole -> {
            existingRole.setRoleName(updatedRoleData.getRoleName());
            existingRole.setActive(updatedRoleData.getActive());
            return roleRepo.save(existingRole);
        }).orElseThrow(() -> new EntityNotFoundException("Role not found with ID: " + id));
    }

    public void deleteRole(Long id) {
        if (roleRepo.existsById(Math.toIntExact(id))) {
            roleRepo.deleteById(Math.toIntExact(id));
        } else {
            throw new EntityNotFoundException("Role not found with ID: " + id);
        }
    }

    public void deletePermission(Permissions permissions) {
        this.permissionsRepo.delete(permissions);
    }

    public List<Permissions> getAllPermission() {
        return this.permissionsRepo.findAll();
    }

    public Optional<RolePermission> getRolePermissionByRoleAndPermission(int roleId, int permissionsId) {
        System.out.println("ROle " + roleId + "  " + permissionsId);
        return this.rolPermissionsRepo.getRolePermissionByRoleAndPermission(roleId, permissionsId);
    }

    public void saveRolePermission(RolePermission rolepermission) {
        this.rolPermissionsRepo.save(rolepermission);
    }

    public void deleteRolePermission(RolePermission rolePermission) {
        this.rolPermissionsRepo.delete(rolePermission);
    }

    public List<RolePermission> getPermissionsByRole(int roleId) {
        return this.rolPermissionsRepo.getPermissionsByRole(roleId);
    }

    public Optional<Permissions> getPermissionsByNameAndCategory(String category, String permissionsName) {
        return this.permissionsRepo.getPermissionsByNameAndCategory(category, permissionsName);
    }

    public Optional<Role> getRoleByName(String roleName) {
        return this.roleRepo.getRoleByName(roleName);
    }

    public void addRole(Role role) {
        this.roleRepo.save(role);
    }

    public void savePermissionAction(PermissionAction action) {
        this.permissionActionRepo.save(action);
    }

    public void deleteAllPermissionAction(List<PermissionAction> permissionActions) {
        this.permissionActionRepo.deleteAll(permissionActions);
    }

    public List<Permissions> getPermissionByCategory(String category) {
        return this.permissionsRepo.getPermissionByCategory(category);
    }

    public int getPermissionsCountByCategory(String category) {
        return this.rolPermissionsRepo.getPermissionsCountByCategory(category);
    }

    public int getPermissionsMasterCategory(String category) {
        return this.permissionsRepo.getPermissionsMasterCategory(category);
    }

    public List<RolePermission> getPermissionsByRoleAndCategory(int roleId, String category) {
        return this.rolPermissionsRepo.getPermissionsByRoleAndCatrgory(roleId, category);
    }

    public List<Permissions> getPermissionsByCategory(String category) {
        return this.permissionsRepo.getPermissionsByCategory(category);
    }

    public List<PermissionAction> getPermissionActionBYPermissionId(int permissionsId) {
        return this.permissionActionRepo.getPermissionActionBYPermissionId(permissionsId);
    }

    @Override
    public List<Permissions> findAllActivePermissions() {
        return this.permissionsRepo.findAllActivePermissions();
    }

    @Override
    public List<PermissionAction> findByPermissionsId(int permissionsId) {
        return this.permissionActionRepo.findByPermissions_PermissionsId(permissionsId);
    }

    @Override
    public Set<Integer> findAssignedActionIdsByRole(int roleId) {
        return this.rolePermissionActionRepo.findAssignedActionIdsByRole(roleId);
    }

    @Override
    public Set<Integer> findPermissionIdsByRole(int roleId) {
        return this.rolPermissionsRepo.findPermissionIdsByRole(roleId);
    }

    public List<Role> getAllRoles() {
        return this.roleRepo.findAll();
    }

    public Role getRoleById(int roleId) {
        return (Role)this.roleRepo.getById(Integer.valueOf(roleId));
    }

    public Permissions getPermissionsById(int permissionId) {
        return (Permissions)this.permissionsRepo.getById(Integer.valueOf(permissionId));
    }

    public Optional<PermissionAction> getPermissionActionBYPermissionIdAndActionName(int permissionsId, String actionName) {
        return this.permissionActionRepo.getPermissionActionBYPermissionIdAndActionName(permissionsId, actionName);
    }

    public List<Permissions> getAllPermissions() {
        return this.permissionsRepo.findAll();
    }

    @Override
    public List<String> findDistinctCategories() {
        return permissionsRepo.findDistinctCategories();
    }

}
