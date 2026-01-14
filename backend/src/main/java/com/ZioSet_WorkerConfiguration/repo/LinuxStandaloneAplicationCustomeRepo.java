package com.ZioSet_WorkerConfiguration.repo;

import com.ZioSet_WorkerConfiguration.dto.GroupSearchDTO;
import com.ZioSet_WorkerConfiguration.model.LinuxStandalonApplication;

import java.util.List;

public interface LinuxStandaloneAplicationCustomeRepo {
    List<LinuxStandalonApplication> getLinuxStandalonApplicationByLimit(int pageNo, int perPage);

    List<LinuxStandalonApplication> getAllLinuxStandalonApplicationByLimitAndGroupSearch(GroupSearchDTO groupSearchDTO);

    int getCountAllLinuxStandalonApplicationByLimitAndGroupSearch(GroupSearchDTO groupSearchDTO);

}
