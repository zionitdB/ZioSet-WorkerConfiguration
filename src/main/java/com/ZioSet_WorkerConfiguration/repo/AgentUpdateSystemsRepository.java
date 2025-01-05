package com.ZioSet_WorkerConfiguration.repo;

import com.ZioSet_WorkerConfiguration.model.AgentUpdateSystemsEntity;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AgentUpdateSystemsRepository extends JpaRepository<AgentUpdateSystemsEntity, Long> {

    @Query("FROM AgentUpdateSystemsEntity a WHERE a.agentUpdate.uuid = ?1")
    List<AgentUpdateSystemsEntity> getSystemsByUpdateUuid(String updateId);

    long countAllByAgentUpdateId(long updateId);

    @Modifying
    @Transactional
    void deleteAllByAgentUpdateId(long updateId);
}
