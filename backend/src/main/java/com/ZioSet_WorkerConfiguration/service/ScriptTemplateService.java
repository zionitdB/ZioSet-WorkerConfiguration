package com.ZioSet_WorkerConfiguration.service;

import com.ZioSet_WorkerConfiguration.dto.CreateScriptTemplateRequest;
import com.ZioSet_WorkerConfiguration.enums.ScriptTargetPlatform;
import com.ZioSet_WorkerConfiguration.model.ScriptFileEntity;
import com.ZioSet_WorkerConfiguration.model.ScriptTemplateEntity;
import com.ZioSet_WorkerConfiguration.repo.ScriptFileRepository;
import com.ZioSet_WorkerConfiguration.repo.ScriptTemplateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ScriptTemplateService {

    private final ScriptTemplateRepository templateRepository;
    private final ScriptFileRepository scriptFileRepository;

    public ScriptTemplateEntity create(CreateScriptTemplateRequest req) {

        ScriptFileEntity scriptFile = getFile(req.scriptFileId());

        ScriptTemplateEntity template = new ScriptTemplateEntity();
        template.setName(req.name());
        template.setDescription(req.description());
        template.setScriptType(req.scriptType());
        template.setScriptFile(scriptFile);

        for (ScriptTargetPlatform p : req.targetPlatforms()) {
            if (p == null) throw new RuntimeException("Invalid platform");
        }
        template.setTargetPlatformsCsv(
                req.targetPlatforms().stream()
                        .map(Enum::name)
                        .collect(Collectors.joining(","))
        );
        return templateRepository.save(template);
    }

    private ScriptFileEntity getFile(Long fileId){
        ScriptFileEntity file = scriptFileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("Script file not found"));
        return file;
    }
}
