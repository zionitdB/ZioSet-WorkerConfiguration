package com.ZioSet_WorkerConfiguration.repo;

import com.ZioSet_WorkerConfiguration.model.ScriptTargetSystemEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ScriptTargetSystemRepository extends JpaRepository<ScriptTargetSystemEntity, Long>,ScriptTargetSystemCustomRepo {
    void deleteByScriptId(Long id);

    Page<ScriptTargetSystemEntity> findAllByScriptId(Long id, Pageable pageable);
    List<ScriptTargetSystemEntity> findAllByScriptId(Long id);
}
