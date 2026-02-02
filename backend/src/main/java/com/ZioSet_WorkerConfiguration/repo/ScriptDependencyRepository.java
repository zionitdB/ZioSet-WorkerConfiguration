package com.ZioSet_WorkerConfiguration.repo;

import com.ZioSet_WorkerConfiguration.model.ScriptDependencyEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ScriptDependencyRepository extends JpaRepository<ScriptDependencyEntity, Long> {
    void deleteByTemplateId(Long id);
    void deleteByScriptId(Long id);

    List<ScriptDependencyEntity> findAllByScriptId(Long scriptId);
}
