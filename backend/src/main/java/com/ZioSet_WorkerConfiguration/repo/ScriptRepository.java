package com.ZioSet_WorkerConfiguration.repo;

import com.ZioSet_WorkerConfiguration.dto.ScriptScheduleCountDto;
import com.ZioSet_WorkerConfiguration.dto.ScriptWithTargetCountDto;
import com.ZioSet_WorkerConfiguration.enums.ScriptApprovalStatus;
import com.ZioSet_WorkerConfiguration.model.ScheduleType;
import com.ZioSet_WorkerConfiguration.model.ScriptEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ScriptRepository extends JpaRepository<ScriptEntity, Long>,ScriptEntityCustomRepo {

    @Query("""
        SELECT new com.ZioSet_WorkerConfiguration.dto.ScriptWithTargetCountDto(
            s.id,
            s.name,
            COUNT(t.id)
        )
        FROM ScriptEntity s
        LEFT JOIN s.targets t
        WHERE s.scheduleType IN :scheduleTypes
        GROUP BY s.id, s.name
    """)
    List<ScriptWithTargetCountDto> findScriptsWithTargetCountByScheduleTypes(
            @Param("scheduleTypes") List<ScheduleType> scheduleTypes
    );

    @Query("""
        SELECT MAX(s.scriptId)
        FROM ScriptEntity s
        WHERE s.scriptId LIKE CONCAT(:yearMonth, '%')
    """)
    String findMaxScriptIdByYearMonth(@Param("yearMonth") String yearMonth);


    @Query("""
        SELECT new com.ZioSet_WorkerConfiguration.dto.ScriptScheduleCountDto(
            SUM(CASE WHEN s.scheduleType IN ('NONE', 'ONE_TIME') THEN 1 ELSE 0 END),
            SUM(CASE WHEN s.scheduleType IN ('REPEAT_EVERY', 'WEEKLY', 'MONTHLY') THEN 1 ELSE 0 END)
        )
        FROM ScriptEntity s
    """)
    ScriptScheduleCountDto fetchScheduleTypeCounts();

    @Query(
            value = """
        SELECT EXISTS (
            SELECT 1
            FROM scripts s
            WHERE s.id = :scriptId
              AND s.schedule_type = 'ONE_TIME'
        )
    """,
            nativeQuery = true
    )
    Long checkScriptIsOneTime(@Param("scriptId") Long scriptId);

    Page<ScriptEntity> findByApprovalStatus(
            ScriptApprovalStatus status,
            Pageable pageable
    );

    @Query("""
        SELECT DISTINCT s
        FROM ScriptEntity s
        LEFT JOIN s.template t
        WHERE
            s.parsingFormat IS NOT NULL
            OR
            (
                s.parsingFormat IS NULL
                AND t.parsingTemplate IS NOT NULL
            )
    """)
    Page<ScriptEntity> findScriptsWithParsingRules(Pageable pageable);


}
