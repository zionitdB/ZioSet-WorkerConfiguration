package com.ZioSet_WorkerConfiguration.repo;

import com.ZioSet_WorkerConfiguration.dto.GroupSearchDTO;
import com.ZioSet_WorkerConfiguration.model.ScriptEntity;

import java.util.List;

public interface ScriptEntityCustomRepo {
    List<ScriptEntity> getScriptEntityByLimit(int pageNo, int perPage);

    List<ScriptEntity> getAllScriptEntityByLimitAndGroupSearch(GroupSearchDTO groupSearchDTO);

    int getCountAllScriptEntityByLimitAndGroupSearch(GroupSearchDTO groupSearchDTO);

}
