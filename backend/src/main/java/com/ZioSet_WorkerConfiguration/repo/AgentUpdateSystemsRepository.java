package com.ZioSet_WorkerConfiguration.repo;

import com.ZioSet_WorkerConfiguration.model.AgentUpdateSystemsEntity;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface AgentUpdateSystemsRepository extends JpaRepository<AgentUpdateSystemsEntity, Long> ,AgentUpdateSystemsEntityCustomeRepo{

    @Query("FROM AgentUpdateSystemsEntity a WHERE a.agentUpdate.uuid = ?1")
    List<AgentUpdateSystemsEntity> getSystemsByUpdateUuid(String updateId);

    long countAllByAgentUpdateId(long updateId);

    @Modifying
    @Transactional
    void deleteAllByAgentUpdateId(long updateId);

    @Query("""
    SELECT FUNCTION('DATE', a.createdAt),
           SUM(CASE WHEN s.isUpdated = true THEN 1 ELSE 0 END),
           SUM(CASE WHEN s.isUpdated = false THEN 1 ELSE 0 END),
           SUM(CASE WHEN s.updatedAt = null THEN 1 ELSE 0 END)
    FROM AgentUpdateSystemsEntity s
    JOIN s.agentUpdate a
    WHERE a.createdAt >= :fromDate
    GROUP BY FUNCTION('DATE', a.createdAt)
    ORDER BY FUNCTION('DATE', a.createdAt) ASC
""")
    List<Object[]> getLast7DaysCounts(@Param("fromDate") LocalDateTime fromDate);

    @Query("""
    SELECT 
        COUNT(s),
        SUM(CASE WHEN s.isUpdated = true THEN 1 ELSE 0 END),
        SUM(CASE WHEN s.isUpdated = false THEN 1 ELSE 0 END),
        SUM(CASE WHEN s.updatedAt = null THEN 1 ELSE 0 END)
    FROM AgentUpdateSystemsEntity s
""")
    Object[] getOverallDashboard();


    @Query("SELECT s FROM AgentUpdateSystemsEntity s where s.isUpdated = true order by s.createdAt ASC")
    List<AgentUpdateSystemsEntity> findAllData();
}
