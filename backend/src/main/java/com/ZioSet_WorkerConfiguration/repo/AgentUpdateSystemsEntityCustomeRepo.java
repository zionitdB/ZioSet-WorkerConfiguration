package com.ZioSet_WorkerConfiguration.repo;

import com.ZioSet_WorkerConfiguration.dto.GroupSearchDTO;
import com.ZioSet_WorkerConfiguration.model.AgentUpdateSystemsEntity;
import com.ZioSet_WorkerConfiguration.model.Category;

import java.util.List;

public interface AgentUpdateSystemsEntityCustomeRepo {
    List<AgentUpdateSystemsEntity> getAgentUpdateSystemsByLimit(int pageNo, int perPage);

    List<AgentUpdateSystemsEntity> getAllAgentUpdateSystemsByLimitAndGroupSearch(GroupSearchDTO groupSearchDTO);

    int getCountAllAgentUpdateSystemsByLimitAndGroupSearch(GroupSearchDTO groupSearchDTO);

}
