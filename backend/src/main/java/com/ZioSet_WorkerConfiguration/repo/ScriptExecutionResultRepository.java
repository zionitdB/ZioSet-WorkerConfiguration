package com.ZioSet_WorkerConfiguration.repo;

import com.ZioSet_WorkerConfiguration.model.ScriptExecutionResultEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ScriptExecutionResultRepository
        extends JpaRepository<ScriptExecutionResultEntity, Long>,
        JpaSpecificationExecutor<ScriptExecutionResultEntity> {
}
