package com.ZioSet_WorkerConfiguration.repo;

import com.ZioSet_WorkerConfiguration.dto.GroupSearchDTO;
import com.ZioSet_WorkerConfiguration.model.LinuxInstalledSystemEntity;

import java.util.List;

public interface LinuxInstalledSystemCustomeRepo {
    List<LinuxInstalledSystemEntity> getLinuxInstalledSystemByLimit(int pageNo, int perPage);

    List<LinuxInstalledSystemEntity> getAllLinuxInstalledSystemByLimitAndGroupSearch(GroupSearchDTO groupSearchDTO);

    int getCountAllLinuxInstalledSystemByLimitAndGroupSearch(GroupSearchDTO groupSearchDTO);

}
