package com.ZioSet_WorkerConfiguration.service;

import com.ZioSet_WorkerConfiguration.dto.ScriptDTO;
import com.ZioSet_WorkerConfiguration.model.*;
import com.ZioSet_WorkerConfiguration.repo.ScriptDependencyRepository;
import com.ZioSet_WorkerConfiguration.repo.ScriptFileRepository;
import com.ZioSet_WorkerConfiguration.repo.ScriptRepository;
import com.ZioSet_WorkerConfiguration.repo.ScriptTargetSystemRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ScriptService {

    private final ScriptRepository scriptRepository;
    private final ScriptFileRepository scriptFileRepository;
    private final ScriptDependencyRepository dependencyRepository;
    private final ScriptTargetSystemRepository targetSystemRepository;

    @Transactional
    public ScriptEntity createOrUpdateScript(ScriptDTO dto) {
        ScriptEntity script = (dto.getId() != null)
                ? scriptRepository.findById(dto.getId()).orElse(new ScriptEntity())
                : new ScriptEntity();

        script.setName(dto.getName());
        script.setDescription(dto.getDescription());
        script.setScriptType(dto.getScriptType());
        script.setScriptText(dto.getScriptText());
        script.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);

        if (dto.getScriptFileId() != null) {
            ScriptFileEntity file = scriptFileRepository.findById(dto.getScriptFileId())
                    .orElseThrow(() -> new RuntimeException("Script file not found"));
            script.setScriptFile(file);
        }

        script = scriptRepository.save(script);

        // Save dependencies
        dependencyRepository.deleteByScriptId(script.getId());
        if (dto.getDependencyFileIds() != null) {
            for (Long fileId : dto.getDependencyFileIds()) {
                ScriptFileEntity file = scriptFileRepository.findById(fileId)
                        .orElseThrow(() -> new RuntimeException("Dependency file not found"));
                ScriptDependencyEntity dep = new ScriptDependencyEntity();
                dep.setScript(script);
                dep.setScriptFile(file);
                dependencyRepository.save(dep);
            }
        }

        // Save targets
        targetSystemRepository.deleteByScriptId(script.getId());
        if (dto.getTargetSystemSerials() != null) {
            for (String serial : dto.getTargetSystemSerials()) {
                ScriptTargetSystemEntity target = new ScriptTargetSystemEntity();
                target.setScript(script);
                target.setSystemSerialNumber(serial);
                targetSystemRepository.save(target);
            }
        }

        return script;
    }

    public List<ScriptEntity> getAllScripts() {
        return scriptRepository.findAll();
    }

    public Optional<ScriptEntity> getScript(Long id) {
        return scriptRepository.findById(id);
    }

    public void deleteScript(Long id) {
        scriptRepository.deleteById(id);
    }
}
