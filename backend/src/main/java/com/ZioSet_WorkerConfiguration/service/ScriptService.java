package com.ZioSet_WorkerConfiguration.service;

import com.ZioSet_WorkerConfiguration.dto.GroupSearchDTO;
import com.ZioSet_WorkerConfiguration.dto.ScriptDTO;
import com.ZioSet_WorkerConfiguration.enums.ScriptTargetPlatform;
import com.ZioSet_WorkerConfiguration.model.*;
import com.ZioSet_WorkerConfiguration.repo.ScriptDependencyRepository;
import com.ZioSet_WorkerConfiguration.repo.ScriptFileRepository;
import com.ZioSet_WorkerConfiguration.repo.ScriptRepository;
import com.ZioSet_WorkerConfiguration.repo.ScriptTargetSystemRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

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

        // Validate platform enums
        if (dto.getTargetPlatforms() != null && !dto.getTargetPlatforms().isEmpty()) {
            for (ScriptTargetPlatform p : dto.getTargetPlatforms()) {
                if (p == null) throw new RuntimeException("Invalid platform");
            }
            script.setTargetPlatformsCsv(
                    dto.getTargetPlatforms().stream()
                            .map(Enum::name)
                            .collect(Collectors.joining(","))
            );
        } else {
            script.setTargetPlatformsCsv(null);
        }

        // Scheduling fields
        script.setScheduleType(dto.getScheduleType());
        script.setStartDateTime(dto.getStartDateTime());
        script.setRepeatEverySeconds(dto.getRepeatEverySeconds());

        if (dto.getWeekDays() != null && !dto.getWeekDays().isEmpty()) {
            script.setWeekDaysCsv(String.join(",", dto.getWeekDays()));
        } else {
            script.setWeekDaysCsv(null);
        }

        script.setMonthDay(dto.getMonthDay());
        script.setTimeOfDay(dto.getTimeOfDay());

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
        ScriptEntity entity = scriptRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ScriptEntity not found"));

        scriptRepository.deleteById(id);
    }

    @Transactional
    public ScriptEntity setScriptActive(Long id, boolean active) {
        ScriptEntity script = scriptRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Script not found"));
        script.setIsActive(active);
        return scriptRepository.save(script);
    }

    public Set<ScriptTargetSystemEntity> getScriptTargetSystems(Long id) {
        return scriptRepository.findById(id)
                .map(ScriptEntity::getTargets)
                .orElseThrow(() -> new RuntimeException("Script not found"));
    }

    public List<ScriptTargetSystemEntity> getScriptTargetSystemByLimit(int pageNo, int perPage) {
        return targetSystemRepository.getScriptTargetSystemByLimit(pageNo, perPage);
    }

    public List<ScriptTargetSystemEntity> getAllScriptTargetSystemByLimitAndGroupSearch(GroupSearchDTO groupSearchDTO) {
        return targetSystemRepository.getAllScriptTargetSystemByLimitAndGroupSearch(groupSearchDTO);
    }

    public int getCountAllScriptTargetSystemByLimitAndGroupSearch(GroupSearchDTO groupSearchDTO) {
        return targetSystemRepository.getCountAllScriptTargetSystemByLimitAndGroupSearch(groupSearchDTO);
    }

    public List<ScriptEntity> getScriptEntityByLimit(int pageNo, int perPage){
        return scriptRepository.getScriptEntityByLimit(pageNo, perPage);
    }

    public List<ScriptEntity> getAllScriptEntityByLimitAndGroupSearch(GroupSearchDTO groupSearchDTO){
        return scriptRepository.getAllScriptEntityByLimitAndGroupSearch(groupSearchDTO);
    }

    public int getCountAllScriptEntityByLimitAndGroupSearch(GroupSearchDTO groupSearchDTO){
        return scriptRepository.getCountAllScriptEntityByLimitAndGroupSearch(groupSearchDTO);
    }


}
