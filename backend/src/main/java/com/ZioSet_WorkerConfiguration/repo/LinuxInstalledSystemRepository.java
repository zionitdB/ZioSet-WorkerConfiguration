package com.ZioSet_WorkerConfiguration.repo;

import com.ZioSet_WorkerConfiguration.model.LinuxInstalledSystemEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LinuxInstalledSystemRepository extends JpaRepository<LinuxInstalledSystemEntity, Long> {
    Optional<LinuxInstalledSystemEntity> findBySystemSerialNo(String serialNumber);
}
