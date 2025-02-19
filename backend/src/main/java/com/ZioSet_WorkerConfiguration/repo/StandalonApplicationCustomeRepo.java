package com.ZioSet_WorkerConfiguration.repo;

import java.util.List;

import com.ZioSet_WorkerConfiguration.dto.GroupSearchDTO;
import com.ZioSet_WorkerConfiguration.model.StandalonApplication;

public interface StandalonApplicationCustomeRepo {
	List<StandalonApplication> getStandalonApplicationByLimit(int pageNo, int perPage);

	List<StandalonApplication> getAllStandalonApplicationByLimitAndGroupSearch(GroupSearchDTO groupSearchDTO);

	int getCountAllStandalonApplicationByLimitAndGroupSearch(GroupSearchDTO groupSearchDTO);

}
