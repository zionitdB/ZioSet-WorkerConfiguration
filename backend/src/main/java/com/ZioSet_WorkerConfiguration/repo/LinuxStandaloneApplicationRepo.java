package com.ZioSet_WorkerConfiguration.repo;

import com.ZioSet_WorkerConfiguration.model.LinuxStandalonApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface LinuxStandaloneApplicationRepo extends JpaRepository<LinuxStandalonApplication, Integer>,LinuxStandaloneAplicationCustomeRepo{
	@Query("select m from LinuxStandalonApplication m where m.active = 1")
	List<LinuxStandalonApplication> getActiveStandalonApplicationList();
}
