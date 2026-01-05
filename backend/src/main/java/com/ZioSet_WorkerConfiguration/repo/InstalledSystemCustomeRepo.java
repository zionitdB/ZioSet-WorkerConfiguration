package com.ZioSet_WorkerConfiguration.repo;

import com.ZioSet_WorkerConfiguration.dto.GroupSearchDTO;
import com.ZioSet_WorkerConfiguration.model.InstalledSystemEntity;

import java.util.List;

public interface InstalledSystemCustomeRepo {
    List<InstalledSystemEntity> getInstalledSystemEntityyByLimit(int pageNo, int perPage);

    List<InstalledSystemEntity> getAllInstalledSystemEntityyByLimitAndGroupSearch(GroupSearchDTO groupSearchDTO);

    int getCountAllInstalledSystemEntityByLimitAndGroupSearch(GroupSearchDTO groupSearchDTO);

}
