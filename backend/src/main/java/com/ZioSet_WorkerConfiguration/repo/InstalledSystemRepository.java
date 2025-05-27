package com.ZioSet_WorkerConfiguration.repo;

import com.ZioSet_WorkerConfiguration.model.InstalledSystemEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InstalledSystemRepository extends JpaRepository<InstalledSystemEntity, Long> {
    Optional<InstalledSystemEntity> findBySystemSerialNo(String serialNumber);

    List<InstalledSystemEntity> findAllBySystemSerialNoIn(List<String> serialNumbers);
}
