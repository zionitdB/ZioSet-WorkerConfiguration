package com.ZioSet_WorkerConfiguration.repo;

import com.ZioSet_WorkerConfiguration.dto.GroupSearchDTO;
import com.ZioSet_WorkerConfiguration.model.InstalledSystemEntity;

import java.util.List;

public interface InstalledSystemCustomeRepo {
    List<InstalledSystemEntity> getInstalledSystemByLimit(int pageNo, int perPage);

    List<InstalledSystemEntity> getAllInstalledSystemByLimitAndGroupSearch(GroupSearchDTO groupSearchDTO);

    int getCountAllInstalledSystemByLimitAndGroupSearch(GroupSearchDTO groupSearchDTO);

}
