package com.ZioSet_WorkerConfiguration.repo;

import com.ZioSet_WorkerConfiguration.model.DeletedSystems;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeletedSystemsRepo extends JpaRepository<DeletedSystems, Long> {
}
