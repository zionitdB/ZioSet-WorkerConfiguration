package com.ZioSet_WorkerConfiguration.rolepermission.repository;

import com.ZioSet_WorkerConfiguration.rolepermission.model.ModulePermission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ModuleRepository extends JpaRepository<ModulePermission,Integer> {
    boolean existsByModuleName(String moduleName);

    List<ModulePermission> findByActiveTrue();
}
