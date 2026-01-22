package com.ZioSet_WorkerConfiguration.service;

import com.ZioSet_WorkerConfiguration.dto.CreateScriptTemplateRequest;
import com.ZioSet_WorkerConfiguration.enums.ScriptTargetPlatform;
import com.ZioSet_WorkerConfiguration.model.ScriptDependencyEntity;
import com.ZioSet_WorkerConfiguration.model.ScriptFileEntity;
import com.ZioSet_WorkerConfiguration.model.ScriptTemplateEntity;
import com.ZioSet_WorkerConfiguration.repo.ScriptDependencyRepository;
import com.ZioSet_WorkerConfiguration.repo.ScriptFileRepository;
import com.ZioSet_WorkerConfiguration.repo.ScriptTemplateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ScriptTemplateService {

    private final ScriptTemplateRepository templateRepository;
    private final ScriptFileRepository scriptFileRepository;
    private final ScriptDependencyRepository dependencyRepository;

    public ScriptTemplateEntity createOrUpdateTemplate(CreateScriptTemplateRequest dto) {

        ScriptTemplateEntity template = (dto.id() != null) ? templateRepository.findById(dto.id())
                        .orElse(new ScriptTemplateEntity()) : new ScriptTemplateEntity();

        template.setName(dto.name());
        template.setDescription(dto.description());
        template.setScriptType(dto.scriptType());
        template.setIsActive(dto.active() != null ? dto.active() : true);
        template.setParameters(dto.parameters());
        template.setCommand(dto.command());

        if (dto.scriptFileId() != null) {
            ScriptFileEntity file = getFile(dto.scriptFileId());
            template.setScriptFile(file);
        }

        if (dto.targetPlatforms() != null && !dto.targetPlatforms().isEmpty()) {
            template.setTargetPlatformsCsv(
                    dto.targetPlatforms().stream()
                            .map(Enum::name)
                            .collect(Collectors.joining(","))
            );
        } else {
            template.setTargetPlatformsCsv(null);
        }

        template = templateRepository.save(template);

        dependencyRepository.deleteByTemplateId(template.getId());
        if (dto.dependencyFileIds() != null) {
            for (Long fileId : dto.dependencyFileIds()) {
                ScriptFileEntity file = scriptFileRepository.findById(fileId)
                        .orElseThrow(() -> new RuntimeException("Dependency file not found"));

                ScriptDependencyEntity dep = new ScriptDependencyEntity();
                dep.setTemplate(template);
                dep.setScriptFile(file);
                dependencyRepository.save(dep);
            }
        }

        return template;
    }

    private ScriptFileEntity getFile(Long fileId){
        return scriptFileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("Script file not found"));
    }

    public void deactivate(Long id) {
        ScriptTemplateEntity template = templateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Template not found"));

        template.setIsActive(false);
        templateRepository.save(template);
    }

    public Page<ScriptTemplateEntity> list(int page, int size) {
        Pageable pageable = PageRequest.of(page-1, size, Sort.by("createdAt").descending());
        return templateRepository.findByIsActiveTrue(pageable);
    }


}
