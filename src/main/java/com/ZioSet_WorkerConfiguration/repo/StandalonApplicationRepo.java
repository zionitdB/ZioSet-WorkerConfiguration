package com.ZioSet_WorkerConfiguration.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; 

import com.ZioSet_WorkerConfiguration.dto.GroupSearchDTO;
import com.ZioSet_WorkerConfiguration.model.StandalonApplication;

public interface StandalonApplicationRepo extends JpaRepository<StandalonApplication, Integer>,StandalonApplicationCustomeRepo{

	List<StandalonApplication> getStandalonApplicationByLimit(int pageNo, int perPage);

	List<StandalonApplication> getAllStandalonApplicationByLimitAndGroupSearch(GroupSearchDTO groupSearchDTO);

	int getCountAllStandalonApplicationByLimitAndGroupSearch(GroupSearchDTO groupSearchDTO);

	@Query("From StandalonApplication s where s.active=1")
	List<StandalonApplication> getActiveStandalonApplicationList();

}
