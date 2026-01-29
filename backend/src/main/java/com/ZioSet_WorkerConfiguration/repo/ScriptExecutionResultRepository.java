package com.ZioSet_WorkerConfiguration.repo;

import com.ZioSet_WorkerConfiguration.dto.DashboardCountsView;
import com.ZioSet_WorkerConfiguration.model.ScriptExecutionResultEntity;
import com.ZioSet_WorkerConfiguration.model.ScriptTargetSystemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;

public interface ScriptExecutionResultRepository
        extends JpaRepository<ScriptExecutionResultEntity, Long>,
        JpaSpecificationExecutor<ScriptExecutionResultEntity> {

    long countByScriptId(Long scriptId);


    @Query("""
    select r
    from ScriptExecutionResultEntity r
    where (:scriptId is null or r.script.id = :scriptId)
      order by r.receivedAt DESC
    """)
    List<ScriptExecutionResultEntity> findAllByScriptId(Long scriptId);

    List<ScriptExecutionResultEntity>
    findBySystemSerialNumberOrderByReceivedAtDesc(String serial);

        @Query("""
    select
      sum(case when r.finishedAt is not null and r.returnCode = 0 then 1 else 0 end) as success,
      sum(case when r.finishedAt is not null and (r.returnCode is null or r.returnCode <> 0) then 1 else 0 end) as failed,
      sum(case when r.finishedAt is null then 1 else 0 end) as pending,
      count(r.id) as total
    from ScriptExecutionResultEntity r
    where (:scriptId is null or r.script.id = :scriptId)
      and (:serial is null or :serial = '' or r.systemSerialNumber = :serial)
      and (:host is null or :host = '' or r.hostName = :host)
      and (:from is null or r.startedAt >= :from)
      and (:to is null or r.startedAt <= :to)
    """)
        DashboardCountsView dashboardCounts(
                @Param("scriptId") Long scriptId,
                @Param("serial") String serial,
                @Param("host") String host,
                @Param("from") Instant from,
                @Param("to") Instant to
        );

    @Query("""
    select r
    from ScriptExecutionResultEntity r
    where (:scriptId is null or r.script.id = :scriptId)
      and (:serial is null or :serial = '' or r.systemSerialNumber = :serial)
      and (:host is null or :host = '' or r.hostName = :host)
      and (:from is null or r.startedAt >= :from)
      and (:to is null or r.startedAt <= :to)
      and (:returnCode is null or r.returnCode = :returnCode)
    """)
    List<ScriptExecutionResultEntity> filterResultList(
            @Param("scriptId") Long scriptId,
            @Param("serial") String serial,
            @Param("host") String host,
            @Param("from") Instant from,
            @Param("to") Instant to,
            @Param("returnCode") Integer returnCode
    );

    @Query("""
    SELECT ts
    FROM ScriptTargetSystemEntity ts
    WHERE (:scriptId IS NULL OR ts.script.id = :scriptId)
    AND NOT EXISTS (
        SELECT 1
        FROM ScriptExecutionResultEntity ser
        WHERE ser.systemSerialNumber = ts.systemSerialNumber
        AND (:scriptId IS NULL OR ser.script.id = :scriptId)
    )
""")
    List<ScriptTargetSystemEntity> findPendingSystems(@Param("scriptId") Long scriptId);







}
