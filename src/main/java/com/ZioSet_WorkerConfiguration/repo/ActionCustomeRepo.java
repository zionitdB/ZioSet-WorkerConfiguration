package com.ZioSet_WorkerConfiguration.repo;

import java.util.List;

import com.ZioSet_WorkerConfiguration.dto.GroupSearchDTO;
import com.ZioSet_WorkerConfiguration.model.Action;
import com.ZioSet_WorkerConfiguration.model.Category;

public interface ActionCustomeRepo {

	List<Action> getActionsByLimit(int pageNo, int perPage);

	List<Action> getAllActionByLimitAndGroupSearch(GroupSearchDTO groupSearchDTO);

	int getCountAllActionByLimitAndGroupSearch(GroupSearchDTO groupSearchDTO);
}
