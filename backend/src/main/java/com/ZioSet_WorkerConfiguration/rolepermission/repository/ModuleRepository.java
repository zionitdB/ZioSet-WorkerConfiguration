package com.ZioSet_WorkerConfiguration.rolepermission.repository;

import com.ZioSet_WorkerConfiguration.rolepermission.model.ModulePermission;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ModuleRepository extends JpaRepository<ModulePermission,Integer> {
}
