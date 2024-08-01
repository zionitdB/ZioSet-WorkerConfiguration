package com.ZioSet_WorkerConfiguration.repo;

import java.util.List;

import com.ZioSet_WorkerConfiguration.dto.GroupSearchDTO;
import com.ZioSet_WorkerConfiguration.model.Category;

public interface CategoryCustomeRepo {
	List<Category> getCategorysByLimit(int pageNo, int perPage);

	List<Category> getAllCategoryByLimitAndGroupSearch(GroupSearchDTO groupSearchDTO);

	int getCountAllCategoryByLimitAndGroupSearch(GroupSearchDTO groupSearchDTO);

}
