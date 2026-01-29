package com.ZioSet_WorkerConfiguration.service;

import com.ZioSet_WorkerConfiguration.dto.*;
import com.ZioSet_WorkerConfiguration.model.*;
import com.ZioSet_WorkerConfiguration.placholder.service.ScriptParserService;
import com.ZioSet_WorkerConfiguration.repo.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;
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

        ScriptTemplateEntity template = (dto.getTemplateId() != null) ? getTemplate(dto.getTemplateId()) : null;

        execution.setTemplate(template);
        execution.setName(dto.getName());
        execution.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);
        execution.setAddedBy(dto.getAddedBy());
        execution.setDescription(dto.getDescription());
        execution.setScriptType(dto.getScriptType());
        execution.setScriptId(generateNextCode());
//        execution.setHostName(dto.getHostName());

        //target-platforms ,in case to run simple script for systems without needing template
        if (dto.getTargetPlatforms() != null && !dto.getTargetPlatforms().isEmpty()) {
            execution.setTargetPlatformsCsv(
                    dto.getTargetPlatforms().stream()
                            .map(Enum::name)
                            .collect(Collectors.joining(","))
            );
        } else {
            execution.setTargetPlatformsCsv(null);
        }


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

        if(template!=null) {
            String script = parserService.parseScript(template.getParameters(), dto.getParams());
            execution.setScriptText(script);

            Map<String, String> scriptArgs = parserService.extractScriptArguments(template.getParameters(), dto.getParams());
            execution.setScriptArgument(scriptArgs);
        }

        execution = scriptRepository.save(execution);

        targetSystemRepository.deleteByScriptId(execution.getId());
        if (dto.getSerialNoHostName() != null) {
            for ( Map<String,String> systems : dto.getSerialNoHostName()) {
                ScriptTargetSystemEntity target = new ScriptTargetSystemEntity();
                target.setScript(execution);
                target.setSystemSerialNumber(systems.get("serialNo"));
                target.setHostName(systems.get("hostName"));
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


    @Transactional
    public ScriptEntity createScriptArgDto(CreateScriptArgDto dto) {

        ScriptEntity execution =  new ScriptEntity();

        execution.setName(dto.getName());
        execution.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);
        execution.setAddedBy(dto.getAddedBy());
        execution.setDescription(dto.getDescription());

        if (dto.getTargetPlatforms() != null && !dto.getTargetPlatforms().isEmpty()) {
            execution.setTargetPlatformsCsv(
                    dto.getTargetPlatforms().stream()
                            .map(Enum::name)
                            .collect(Collectors.joining(","))
            );
        } else {
            execution.setTargetPlatformsCsv(null);
        }
        ScriptTemplateEntity template = (dto.getTemplateId() != null) ? getTemplate(dto.getTemplateId()) : null;


        // Schedule
        execution.setScheduleType(dto.getScheduleType());
        execution.setStartDateTime(dto.getStartDateTime());
        execution.setRepeatEverySeconds(dto.getRepeatEverySeconds());
        execution.setMonthDay(dto.getMonthDay());
        execution.setTimeOfDay(dto.getTimeOfDay());


        if (dto.getWeekDays() != null && !dto.getWeekDays().isEmpty()) {
            execution.setWeekDaysCsv(String.join(",", dto.getWeekDays()));
        } else {
            execution.setWeekDaysCsv(null);
        }

        String script = parserService.parseScript(template.getParameters(),dto.getParams());
        execution.setScriptText(script);

        Map<String, String> scriptArgs = parserService.extractScriptArguments(template.getParameters(), dto.getParams());
        execution.setScriptArgument(scriptArgs);

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
        scriptRepository.findById(id)
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

    public List<ScriptTargetSystemResponseDTO> getScriptTargetSystems(Long id) {
        return targetSystemRepository.findAllByScriptId(id).stream().map(
                t -> new ScriptTargetSystemResponseDTO(
                        t.getId(),
                        t.getSystemSerialNumber(),
                        t.getAssignedBy(),
                        t.getAssignedAt(),
                        t.getLastRunAt(),
                        t.getScript().getId()
                )
        ).toList();
    }

    public Map<String, List<ScriptWithTargetCountDto>> getScriptsWithTargetCount() {
        List<ScheduleType> ONE_TIME_TYPES =
                List.of(ScheduleType.NONE, ScheduleType.ONE_TIME);

        List<ScheduleType> RECURRING_TYPES =
                List.of(ScheduleType.REPEAT_EVERY, ScheduleType.WEEKLY, ScheduleType.MONTHLY);

        List<ScriptWithTargetCountDto> oneTime = scriptRepository.findScriptsWithTargetCountByScheduleTypes(ONE_TIME_TYPES);
        List<ScriptWithTargetCountDto> recurring = scriptRepository.findScriptsWithTargetCountByScheduleTypes(RECURRING_TYPES);

        return Map.of("OneTimeList",oneTime,
                        "Recurring",recurring);
    }


    public Page<ScriptTargetSystemResponseDTO> getScriptTargetSystemsPagination(Long id, int pageNo, int perPage) {
        Pageable pageable = PageRequest.of(pageNo - 1, perPage);

        return targetSystemRepository.findAllByScriptId(id, pageable)
                .map(t -> new ScriptTargetSystemResponseDTO(
                        t.getId(),
                        t.getSystemSerialNumber(),
                        t.getAssignedBy(),
                        t.getAssignedAt(),
                        t.getLastRunAt(),
                        t.getScript().getId()
                ));
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

    public String generateNextCode() {

        String yearMonth = YearMonth.now().format(DateTimeFormatter.ofPattern("yyyyMM"));

        String maxScriptId = scriptRepository.findMaxScriptIdByYearMonth(yearMonth);

        String nextSequence;
        if (maxScriptId == null) {
            nextSequence = "0001";
        } else {
            int next =
                    Integer.parseInt(maxScriptId.substring(yearMonth.length())) + 1;
            nextSequence = String.format("%04d", next);
        }

        return yearMonth + nextSequence;
    }

    public ScriptScheduleCountDto getScriptScheduleCounts() {
        return scriptRepository.fetchScheduleTypeCounts();
    }

    public long getScriptCount(){
        return scriptRepository.findAll().stream().count();
    }

}
