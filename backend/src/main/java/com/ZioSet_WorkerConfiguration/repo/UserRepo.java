package com.ZioSet_WorkerConfiguration.repo;

import java.util.Optional;

import com.ZioSet_WorkerConfiguration.rolepermission.repository.UserCustomRepo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ZioSet_WorkerConfiguration.model.UserInfo;

public interface UserRepo extends JpaRepository<UserInfo, Integer> , UserCustomRepo {
	@Query("from UserInfo u where u.username=?1")
	Optional<UserInfo> getUsersByUsername(String username);

	boolean existsByUsername(String username);

	boolean existsByEmail(String email);

}
