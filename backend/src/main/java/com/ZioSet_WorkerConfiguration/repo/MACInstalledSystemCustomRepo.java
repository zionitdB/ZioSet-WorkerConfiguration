package com.ZioSet_WorkerConfiguration.repo;

import com.ZioSet_WorkerConfiguration.dto.GroupSearchDTO;
import com.ZioSet_WorkerConfiguration.model.MACInstalledSystemEntity;

import java.util.List;

public interface MACInstalledSystemCustomRepo {
    List<MACInstalledSystemEntity> getMACInstalledSystemEntityByLimit(int pageNo, int perPage);

    List<MACInstalledSystemEntity> getAllMACInstalledSystemEntityByLimitAndGroupSearch(GroupSearchDTO groupSearchDTO);

    int getCountAllMACInstalledSystemEntityyByLimitAndGroupSearch(GroupSearchDTO groupSearchDTO);

}
