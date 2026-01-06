package com.ZioSet_WorkerConfiguration.service;

import com.ZioSet_WorkerConfiguration.components.AgentUpdateMapper;
import com.ZioSet_WorkerConfiguration.dto.AgentUpdateCreateDto;
import com.ZioSet_WorkerConfiguration.dto.GroupSearchDTO;
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
    private final AgentUpdateMapper agentUpdateMapper;

    public AgentUpdateService(AgentUpdateRepository agentUpdateRepository, AgentUpdateSystemsRepository agentUpdateSystemsRepository, AgentUpdateMapper agentUpdateMapper) {
        this.agentUpdateRepository = agentUpdateRepository;
        this.agentUpdateSystemsRepository = agentUpdateSystemsRepository;
        this.agentUpdateMapper = agentUpdateMapper;
    }

    public void addAgentUpdate(AgentUpdateCreateDto agentUpdate) {
        String uuid = UUID.randomUUID().toString();
        AgentUpdateEntity agentUpdateEntity =  agentUpdateMapper.toEntity(uuid, agentUpdate);
        agentUpdateRepository.save(agentUpdateEntity);

/*        try {
            List<AgentUpdateSystemsEntity> systemsEntities = agentUpdate.toAgentUpdateSystemsEntities(agentUpdateEntity);
            agentUpdateSystemsRepository.saveAll(systemsEntities);
        } catch (Exception e) {
            agentUpdateRepository.delete(agentUpdateEntity);
            throw e;
        }*/
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

    public List<AgentUpdateSystemsEntity> getAgentUpdateSystemsByLimit(int pageNo, int perPage) {
        return agentUpdateSystemsRepository.getAgentUpdateSystemsByLimit(pageNo, perPage);
    }

    public List<AgentUpdateSystemsEntity> getAllAgentUpdateSystemsByLimitAndGroupSearch(GroupSearchDTO groupSearchDTO) {
        return agentUpdateSystemsRepository.getAllAgentUpdateSystemsByLimitAndGroupSearch(groupSearchDTO);
    }

    public int getCountAllAgentUpdateSystemsByLimitAndGroupSearch(GroupSearchDTO groupSearchDTO) {
        return agentUpdateSystemsRepository.getCountAllAgentUpdateSystemsByLimitAndGroupSearch(groupSearchDTO);
    }

}
