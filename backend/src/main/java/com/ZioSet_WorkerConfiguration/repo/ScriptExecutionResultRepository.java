package com.ZioSet_WorkerConfiguration.repo;

import com.ZioSet_WorkerConfiguration.model.ScriptExecutionResultEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface ScriptExecutionResultRepository
        extends JpaRepository<ScriptExecutionResultEntity, Long>,
        JpaSpecificationExecutor<ScriptExecutionResultEntity> {

    long countByScriptId(Long scriptId);

    List<ScriptExecutionResultEntity> findAllByScriptId(Long scriptId);

    List<ScriptExecutionResultEntity>
    findBySystemSerialNumberOrderByReceivedAtDesc(String serial);
}
