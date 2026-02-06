package com.ZioSet_WorkerConfiguration.rolepermission.repository;

import com.ZioSet_WorkerConfiguration.rolepermission.model.PermissionBackend;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PermissionBackendRepository extends JpaRepository<PermissionBackend,Long> {
    Optional<PermissionBackend> findByName(String name);
    boolean existsByName(String name);
}
