package com.ZioSet_WorkerConfiguration.repo;

import com.ZioSet_WorkerConfiguration.dto.ScriptWithTargetCountDto;
import com.ZioSet_WorkerConfiguration.model.ScriptEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

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
        GROUP BY s.id, s.name
    """)
    List<ScriptWithTargetCountDto> findAllScriptsWithTargetCount();

}
