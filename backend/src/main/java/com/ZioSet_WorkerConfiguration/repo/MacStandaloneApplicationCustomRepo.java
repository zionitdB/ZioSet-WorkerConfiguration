package com.ZioSet_WorkerConfiguration.repo;

import com.ZioSet_WorkerConfiguration.dto.GroupSearchDTO;
import com.ZioSet_WorkerConfiguration.model.MacStandalonApplication;
import com.ZioSet_WorkerConfiguration.model.ScriptEntity;

import java.util.List;

public interface MacStandaloneApplicationCustomRepo {
    List<MacStandalonApplication> getMacStandaloneApplicationByLimit(int pageNo, int perPage);

    List<MacStandalonApplication> getAllMacStandaloneApplicationByLimitAndGroupSearch(GroupSearchDTO groupSearchDTO);

    int getCountAllMacStandaloneApplicationByLimitAndGroupSearch(GroupSearchDTO groupSearchDTO);

}
