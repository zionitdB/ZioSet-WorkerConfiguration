package com.ZioSet_WorkerConfiguration.components;

import com.ZioSet_WorkerConfiguration.dto.AgentUpdateCreateDto;
import com.ZioSet_WorkerConfiguration.dto.AgentUpdateFileCreateDto;
import com.ZioSet_WorkerConfiguration.enums.AgentUpdateType;
import com.ZioSet_WorkerConfiguration.model.AgentUpdateEntity;
import com.ZioSet_WorkerConfiguration.model.AgentUpdateFileEntity;
import com.ZioSet_WorkerConfiguration.model.AgentUpdateSystemsEntity;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.stream.Collectors;

@Component
public class AgentUpdateMapper {

    public AgentUpdateEntity toEntity(String uuid, AgentUpdateCreateDto dto) {
        AgentUpdateEntity agentUpdateEntity = new AgentUpdateEntity();
        agentUpdateEntity.setUuid(uuid);
        agentUpdateEntity.setTargetDateTime(dto.getTargetDateTime());

        if (dto.getFiles() != null) {
            agentUpdateEntity.setFiles(dto.getFiles().stream()
                    .map(e-> this.toFileEntity(e, agentUpdateEntity))
                    .collect(Collectors.toList()));
        }

        if (dto.getSerialNoHostName() != null) {
            agentUpdateEntity.setTargetSystems(dto.getSerialNoHostName().stream()
                    .map(e-> this.toSystemEntity(e, agentUpdateEntity))
                    .collect(Collectors.toList()));
        }

        return agentUpdateEntity;
    }

    private AgentUpdateFileEntity toFileEntity(AgentUpdateFileCreateDto dto, AgentUpdateEntity parent) {
        AgentUpdateFileEntity fileEntity = new AgentUpdateFileEntity();
        fileEntity.setUpdateType(AgentUpdateType.valueOf(dto.getUpdateType()));
        fileEntity.setFileName(dto.getFileName());
        fileEntity.setServerDirectory(dto.getServerDirectory());
        fileEntity.setLocalDirectory(dto.getLocalDirectory());
        fileEntity.setAgentUpdate(parent);
        return fileEntity;
    }

    private AgentUpdateSystemsEntity toSystemEntity(Map<String,String> systems, AgentUpdateEntity parent) {
        AgentUpdateSystemsEntity systemEntity = new AgentUpdateSystemsEntity();
        systemEntity.setSystemSerialNumber(systems.get("serialNo"));
        systemEntity.setHostName(systems.get("hostName"));
        systemEntity.setAgentUpdate(parent);
        return systemEntity;
    }
}
