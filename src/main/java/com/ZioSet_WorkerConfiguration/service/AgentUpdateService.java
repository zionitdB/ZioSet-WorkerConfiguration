package com.ZioSet_WorkerConfiguration.service;

import com.ZioSet_WorkerConfiguration.dto.AddAgentUpdateDTO;
import com.ZioSet_WorkerConfiguration.model.AgentUpdateEntity;
import com.ZioSet_WorkerConfiguration.model.AgentUpdateSystemsEntity;
import com.ZioSet_WorkerConfiguration.repo.AgentUpdateRepository;
import com.ZioSet_WorkerConfiguration.repo.AgentUpdateSystemsRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class AgentUpdateService {

    private final AgentUpdateRepository agentUpdateRepository;
    private final AgentUpdateSystemsRepository agentUpdateSystemsRepository;

    public AgentUpdateService(AgentUpdateRepository agentUpdateRepository, AgentUpdateSystemsRepository agentUpdateSystemsRepository) {
        this.agentUpdateRepository = agentUpdateRepository;
        this.agentUpdateSystemsRepository = agentUpdateSystemsRepository;
    }

    public void addAgentUpdate(AddAgentUpdateDTO agentUpdate) {
        String uuid = UUID.randomUUID().toString();
        AgentUpdateEntity agentUpdateEntity = agentUpdate.toAgentUpdateEntity(uuid);
        agentUpdateRepository.save(agentUpdateEntity);

        try {
            List<AgentUpdateSystemsEntity> systemsEntities = agentUpdate.toAgentUpdateSystemsEntities(agentUpdateEntity);
            agentUpdateSystemsRepository.saveAll(systemsEntities);
        } catch (Exception e) {
            agentUpdateRepository.delete(agentUpdateEntity);
            throw e;
        }
    }

    public void deleteAgentUpdate(long updateId) {
        agentUpdateSystemsRepository.deleteAllByAgentUpdateId(updateId);
        agentUpdateRepository.deleteById(updateId);
    }

    public List<AgentUpdateEntity> getAllAgentUpdates() {
        List<AgentUpdateEntity> list = agentUpdateRepository.findAll();
        for (AgentUpdateEntity agentUpdateEntity : list) {
            agentUpdateEntity.setTargetSystemsCount(agentUpdateSystemsRepository.countAllByAgentUpdateId(agentUpdateEntity.getId()));
        }
        return list;
    }

    public List<AgentUpdateSystemsEntity> getSystemsByUpdateUuid(String updateId) {
        return agentUpdateSystemsRepository.getSystemsByUpdateUuid(updateId);
    }

    public void deleteTargetSystemById(long targetSystemId) {
        agentUpdateSystemsRepository.deleteById(targetSystemId);
    }

}
