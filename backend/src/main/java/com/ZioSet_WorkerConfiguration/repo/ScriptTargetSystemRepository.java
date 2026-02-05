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
            where t.script.id=:scriptId""")
    Page<ScriptTargetSystemEntity> findPendingTargets(
            @Param("scriptId") Long scriptId,
            Pageable pageable
    );

    @Query("""
            select t from ScriptTargetSystemEntity t
            left join ScriptExecutionResultEntity r
            on t.script.id=r.script.id
            AND t.systemSerialNumber=r.systemSerialNumber
            where t.script.id=:scriptId""")
    List<ScriptTargetSystemEntity> findPendingTargets(
            @Param("scriptId") Long scriptId
    );

    @Query("""
        select t
        from ScriptTargetSystemEntity t
        join Asset a
            on a.serialNo = t.systemSerialNumber
        where t.script.id = :scriptId
          and COALESCE(a.locationName, 'UNKNOWN') = :location
          and not exists (
              select 1
              from ScriptExecutionResultEntity r
              where r.script.id = t.script.id
                and r.systemSerialNumber = t.systemSerialNumber
          )
    """)
    List<ScriptTargetSystemEntity> findPendingTargetsByLocation(
            @Param("scriptId") Long scriptId,
            @Param("location") String location
    );

    @Query("""
    select t
    from ScriptTargetSystemEntity t
    join Asset a
        on a.serialNo = t.systemSerialNumber
    join ScriptExecutionResultEntity r
        on r.script.id = t.script.id
       and r.systemSerialNumber = t.systemSerialNumber
    where t.script.id = :scriptId
      and COALESCE(a.locationName, 'UNKNOWN') = :location
      AND r.returnCode = :returnCode
""")
    List<ScriptTargetSystemEntity> findTargetSystemsByCodeAndLocation(
            @Param("scriptId") Long scriptId,
            @Param("location") String location,
            @Param("returnCode") Integer returnCode
    );
}
