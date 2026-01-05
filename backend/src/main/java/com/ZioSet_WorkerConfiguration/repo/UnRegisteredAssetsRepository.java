package com.ZioSet_WorkerConfiguration.repo;

import com.ZioSet_WorkerConfiguration.model.UnRegisteredAssets;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UnRegisteredAssetsRepository extends JpaRepository<UnRegisteredAssets, Long> ,UnRegisteredAssetsCustomRepo{
    void deleteBySystemSerialNumber(String systemSerialNumber);
}
