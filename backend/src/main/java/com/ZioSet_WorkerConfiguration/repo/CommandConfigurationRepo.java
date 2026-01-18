package com.ZioSet_WorkerConfiguration.repo;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ZioSet_WorkerConfiguration.dto.GroupSearchDTO;
import com.ZioSet_WorkerConfiguration.model.Action;
import com.ZioSet_WorkerConfiguration.model.CommandConfiguration;
import org.springframework.data.repository.query.Param;

public interface CommandConfigurationRepo extends JpaRepository<CommandConfiguration, Integer> ,CommandConfigurationCustomeRepo{
	@Query("from CommandConfiguration c where c.action.id=?1")
	List<CommandConfiguration> getAllCommandConfigurationByActionId(int actionId);

	@Query("from CommandConfiguration c where c.action.id=?1")
	Page<CommandConfiguration> getAllCommandConfigurationByActionId(int actionId, Pageable pageable);

	@Query("from CommandConfiguration c where c.commandId=?1")
	List<CommandConfiguration> getCommandsByCommandId(String commandId);

	@Query("SELECT c FROM CommandConfiguration c WHERE c.commandId = :commandId")
	Page<CommandConfiguration> getCommandsByCommandId(@Param("commandId") String commandId, Pageable pageable);

	@Query("SELECT DISTINCT c.commandId FROM CommandConfiguration c WHERE c.action.id=?1")
	List<String> getCommandIdListByAction(int actionId);
}
