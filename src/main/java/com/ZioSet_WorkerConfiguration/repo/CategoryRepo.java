package com.ZioSet_WorkerConfiguration.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ZioSet_WorkerConfiguration.dto.GroupSearchDTO;
import com.ZioSet_WorkerConfiguration.model.Category;

public interface CategoryRepo extends JpaRepository<Category, Integer>,CategoryCustomeRepo{
	@Query("From Category c where c.categoryname=?1")
	Optional<Category> getCategoryByName(String categoryname);
	@Query("From Category c where c.parrentCategory.id=?1")
	List<Category> getAllCategoryByParentId(int parentCategoryId);

	
}
