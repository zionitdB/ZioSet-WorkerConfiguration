package com.ZioSet_WorkerConfiguration.repo;

import com.ZioSet_WorkerConfiguration.model.MACInstalledSystemEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MACInstalledSystemRepository extends JpaRepository<MACInstalledSystemEntity, Long> {
    Optional<MACInstalledSystemEntity> findBySystemSerialNo(String serialNumber);
}
