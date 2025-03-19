package com.ZioSet_WorkerConfiguration.repo;

import com.ZioSet_WorkerConfiguration.model.MacStandalonApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MacStandaloneApplicationRepo extends JpaRepository<MacStandalonApplication, Integer>{
	@Query("select m from MacStandalonApplication m where m.active = 1")
	List<MacStandalonApplication> getActiveStandalonApplicationList();
}
