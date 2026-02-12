package com.ZioSet_WorkerConfiguration.repo;

import com.ZioSet_WorkerConfiguration.model.AgentUpdateEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;

public interface AgentUpdateRepository extends JpaRepository<AgentUpdateEntity, Long> {


    @Query("""
            select count(l) from AgentUpdateEntity l
            where l.createdAt=:today""")
    long getAgentUpdateTodayCount(@Param("today") LocalDate today);
}
