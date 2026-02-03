package com.ZioSet_WorkerConfiguration.repo;

import com.ZioSet_WorkerConfiguration.model.ScriptTargetSystemEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ScriptTargetSystemRepository extends JpaRepository<ScriptTargetSystemEntity, Long>,ScriptTargetSystemCustomRepo {
    void deleteByScriptId(Long id);

    Page<ScriptTargetSystemEntity> findAllByScriptId(Long id, Pageable pageable);

    @Query("""
        SELECT t
        FROM ScriptTargetSystemEntity t
        WHERE (:scriptId IS NULL OR t.script.id = :scriptId)
    """)
    List<ScriptTargetSystemEntity> findAllByScriptId(@Param("scriptId") Long scriptId);


    @Query("""
            select t from ScriptTargetSystemEntity t
            left join ScriptExecutionResultEntity r
            on t.script.id=r.script.id
            AND t.systemSerialNumber=r.systemSerialNumber
            where t.script.id=r.script.id""")
    Page<ScriptTargetSystemEntity> findPendingTargets(
            @Param("scriptId") Long scriptId,
            Pageable pageable
    );

    @Query("""
            select t from ScriptTargetSystemEntity t
            left join ScriptExecutionResultEntity r
            on t.script.id=r.script.id
            AND t.systemSerialNumber=r.systemSerialNumber
            where t.script.id=r.script.id""")
    List<ScriptTargetSystemEntity> findPendingTargets(
            @Param("scriptId") Long scriptId
    );
}
