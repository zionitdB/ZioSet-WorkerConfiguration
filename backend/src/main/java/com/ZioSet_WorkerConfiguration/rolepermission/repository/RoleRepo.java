package com.ZioSet_WorkerConfiguration.rolepermission.repository;

import com.ZioSet_WorkerConfiguration.rolepermission.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface RoleRepo extends JpaRepository<Role, Integer> {
    @Query("From Role r where trim(r.roleName)=?1")
    Optional<Role> getRoleByName(String paramString);

    boolean existsByRoleName(String roleName);
}

