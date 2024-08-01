package com.ZioSet_WorkerConfiguration.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ZioSet_WorkerConfiguration.dto.GroupSearchDTO;
import com.ZioSet_WorkerConfiguration.model.Action;
import com.ZioSet_WorkerConfiguration.model.CommandConfiguration;

public interface CommandConfigurationCustomeRepo  {
	List<CommandConfiguration> getCommandConfigurationsByLimit(int pageNo, int perPage);

	List<CommandConfiguration> getAllCommandConfigurationByLimitAndGroupSearch(GroupSearchDTO groupSearchDTO);

	int getCountAllCommandConfigurationByLimitAndGroupSearch(GroupSearchDTO groupSearchDTO);
}
