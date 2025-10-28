package com.ZioSet_WorkerConfiguration.repo;

import com.ZioSet_WorkerConfiguration.model.ScriptTargetSystemEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScriptTargetSystemRepository extends JpaRepository<ScriptTargetSystemEntity, Long> {
    void deleteByScriptId(Long id);
}
