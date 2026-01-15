package com.ZioSet_WorkerConfiguration.repo;

import com.ZioSet_WorkerConfiguration.dto.GroupSearchDTO;
import com.ZioSet_WorkerConfiguration.model.MACInstalledSystemEntity;

import java.util.List;

public interface MACInstalledSystemCustomRepo {
    List<MACInstalledSystemEntity> getMACInstalledSystemByLimit(int pageNo, int perPage);

    List<MACInstalledSystemEntity> getAllMACInstalledSystemByLimitAndGroupSearch(GroupSearchDTO groupSearchDTO);

    int getCountAllMACInstalledSystemByLimitAndGroupSearch(GroupSearchDTO groupSearchDTO);

}
