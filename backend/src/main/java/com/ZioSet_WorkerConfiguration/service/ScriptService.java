package com.ZioSet_WorkerConfiguration.service;

import com.ZioSet_WorkerConfiguration.dto.GroupSearchDTO;
import com.ZioSet_WorkerConfiguration.dto.ScriptDTO;
import com.ZioSet_WorkerConfiguration.enums.ScriptTargetPlatform;
import com.ZioSet_WorkerConfiguration.model.*;
import com.ZioSet_WorkerConfiguration.placholder.service.ScriptParserService;
import com.ZioSet_WorkerConfiguration.repo.*;
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
    private final ScriptTemplateRepository scriptTemplateRepository;
    private final ScriptParserService parserService;

    private ScriptTemplateEntity getTemplate(Long id){
        return scriptTemplateRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Template not found."));
    }

    @Transactional
    public ScriptEntity createOrUpdateScriptExecution(ScriptDTO dto) {

        ScriptEntity execution = (dto.getId() != null) ? scriptRepository.findById(dto.getId()).orElse(new ScriptEntity())
                        : new ScriptEntity();

        ScriptTemplateEntity template =
                scriptTemplateRepository.findById(dto.getTemplateId())
                        .orElseThrow(() -> new RuntimeException("Template not found"));

        execution.setTemplate(template);
        execution.setName(dto.getName());
        execution.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);


        // Schedule
        execution.setScheduleType(dto.getScheduleType());
        execution.setStartDateTime(dto.getStartDateTime());
        execution.setRepeatEverySeconds(dto.getRepeatEverySeconds());
        execution.setMonthDay(dto.getMonthDay());
        execution.setTimeOfDay(dto.getTimeOfDay());

        if (dto.getScriptFileId() != null) {
            ScriptFileEntity file = getFile(dto.getScriptFileId());
            execution.setScriptFile(file);
        }


        if (dto.getWeekDays() != null && !dto.getWeekDays().isEmpty()) {
            execution.setWeekDaysCsv(String.join(",", dto.getWeekDays()));
        } else {
            execution.setWeekDaysCsv(null);
        }

        String script = parserService.parseScript(template.getParameters(),dto.getParams());
        execution.setScriptText(script);
        execution = scriptRepository.save(execution);

        targetSystemRepository.deleteByScriptId(execution.getId());
        if (dto.getTargetSystemSerials() != null) {
            for (String serial : dto.getTargetSystemSerials()) {
                ScriptTargetSystemEntity target = new ScriptTargetSystemEntity();
                target.setScript(execution);
                target.setSystemSerialNumber(serial);
                targetSystemRepository.save(target);
            }
        }

        dependencyRepository.deleteByScriptId(execution.getId());
        if (dto.getDependencyFileIds() != null) {
            for (Long fileId : dto.getDependencyFileIds()) {
                ScriptFileEntity file = scriptFileRepository.findById(fileId)
                        .orElseThrow(() -> new RuntimeException("Dependency file not found"));

                ScriptDependencyEntity dep = new ScriptDependencyEntity();
                dep.setScript(execution);
                dep.setScriptFile(file);
                dependencyRepository.save(dep);
            }
        }

        return execution;
    }

    private ScriptFileEntity getFile(Long fileId){
        return scriptFileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("Script file not found"));
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
