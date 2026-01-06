package com.ZioSet_WorkerConfiguration.repo;

import com.ZioSet_WorkerConfiguration.dto.GroupSearchDTO;
import com.ZioSet_WorkerConfiguration.model.ScriptTargetSystemEntity;

import java.util.List;

public interface ScriptTargetSystemCustomRepo {
    List<ScriptTargetSystemEntity> getScriptTargetSystemByLimit(int pageNo, int perPage);

    List<ScriptTargetSystemEntity> getAllScriptTargetSystemByLimitAndGroupSearch(GroupSearchDTO groupSearchDTO);

    int getCountAllScriptTargetSystemByLimitAndGroupSearch(GroupSearchDTO groupSearchDTO);

}
