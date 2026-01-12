package com.ZioSet_WorkerConfiguration.repo;

import com.ZioSet_WorkerConfiguration.model.ScriptTemplateEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScriptTemplateRepository extends JpaRepository<ScriptTemplateEntity,Long> {

    Page<ScriptTemplateEntity> findByIsActiveTrue(Pageable pageable);
}
