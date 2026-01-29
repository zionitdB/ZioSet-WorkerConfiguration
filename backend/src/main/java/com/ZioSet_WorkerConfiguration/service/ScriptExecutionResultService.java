package com.ZioSet_WorkerConfiguration.service;

import com.ZioSet_WorkerConfiguration.dto.*;
import com.ZioSet_WorkerConfiguration.model.ScriptExecutionResultEntity;
import com.ZioSet_WorkerConfiguration.model.ScriptTargetSystemEntity;
import com.ZioSet_WorkerConfiguration.model.ScriptTemplateEntity;
import com.ZioSet_WorkerConfiguration.parsing.ExecutionParseRequest;
import com.ZioSet_WorkerConfiguration.parsing.JsonExecutionResultParsingEngine;
import com.ZioSet_WorkerConfiguration.parsing.ParsedExecutionResult;
import com.ZioSet_WorkerConfiguration.parsing.RawExecutionResult;
import com.ZioSet_WorkerConfiguration.repo.ScriptExecutionResultRepository;
import com.ZioSet_WorkerConfiguration.repo.ScriptTargetSystemRepository;
import com.ZioSet_WorkerConfiguration.utils.PagedResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ScriptExecutionResultService {

    private final ScriptExecutionResultRepository repo;
    private final JsonExecutionResultParsingEngine parsingEngine;
    private final ScriptTargetSystemRepository targetRepo;

    public PagedResponse<ScriptExecutionResultSummaryDTO> parse(ExecutionResultFilterDTO filter, int page, int size) {

        Pageable pageable = PageRequest.of(page-1, size, Sort.by("finishedAt").descending());

        Page<ScriptExecutionResultEntity> data =
                repo.findAll(ScriptExecutionResultSpecs.filter(filter), pageable);
        List<ScriptExecutionResultSummaryDTO> results= data.map(this::toSummaryReport).stream().toList();
        return new PagedResponse<>(

                results,
                data.getNumber(),
                data.getSize(),
                data.getTotalElements(),
                data.getTotalPages(),
                data.isLast());

    }

    public Page<ScriptExecutionResultSummaryDTO> getPaginatedResults(
            ExecutionResultFilterDTO filter,
            int page,
            int size
    ) {
        --page;
        Pageable pageable = PageRequest.of(page, size, Sort.by("finishedAt").descending());

        Page<ScriptExecutionResultEntity> data =
                repo.findAll(ScriptExecutionResultSpecs.filter(filter), pageable);

        return data.map(this::toSummary);
    }

    private ScriptExecutionResultSummaryDTO toSummary(ScriptExecutionResultEntity e) {
        ScriptExecutionResultSummaryDTO dto = new ScriptExecutionResultSummaryDTO();
        dto.setId(e.getId());
        dto.setRunUuid(e.getRunUuid());
        dto.setScriptId(e.getScript().getId());
        dto.setScriptName(e.getScript().getName());
        dto.setSystemSerialNumber(e.getSystemSerialNumber());
        dto.setStartedAt(e.getStartedAt());
        dto.setFinishedAt(e.getFinishedAt());
        dto.setReturnCode(e.getReturnCode());
        dto.setStatus(e.getReturnCode() == 0 ? "SUCCESS" : "FAILED");
        dto.setStdout(e.getStdout());
        dto.setStderr(e.getStderr());
        dto.setHostName(e.getHostName());
        return dto;
    }

    private ScriptExecutionResultSummaryDTO toSummaryReport(ScriptExecutionResultEntity e) {
        String status = resolveStatus(e);
        RawExecutionResult rawResult = new RawExecutionResult(
                e.getStdout(),
                e.getStderr()
        );

        String format = Optional
                .ofNullable(e.getScript().getTemplate().getParsingTemplate())
                .orElse(e.getScript().getParsingFormat());

        ParsedExecutionResult parsedOutput =
                parsingEngine.parse(rawResult, format);

        return getScriptExecutionResultSummaryDTO(e, status, parsedOutput);

    }

    private static ScriptExecutionResultSummaryDTO getScriptExecutionResultSummaryDTO(ScriptExecutionResultEntity e, String status, ParsedExecutionResult parsedOutput) {
        ScriptExecutionResultSummaryDTO dto = new ScriptExecutionResultSummaryDTO();

        dto.setId(e.getId());
        dto.setRunUuid(e.getRunUuid());
        dto.setScriptId(e.getScript().getId());
        dto.setScriptName(e.getScript().getName());
        dto.setSystemSerialNumber(e.getSystemSerialNumber());
        dto.setStartedAt(e.getStartedAt());
        dto.setFinishedAt(e.getFinishedAt());
        dto.setReturnCode(e.getReturnCode());
        dto.setStatus(status);
        dto.setStdout(e.getStdout());
        dto.setStderr(e.getStderr());
        dto.setHostName(e.getHostName());
        dto.setParsedData(parsedOutput);
        return dto;
    }


    private String resolveStatus(ScriptExecutionResultEntity entity) {
        if (entity.getFinishedAt() == null) return "PENDING";
        if (entity.getReturnCode() != null && entity.getReturnCode() == 0)
            return "SUCCESS";
        return "FAILED";
    }


    public List<ScriptExecutionResultSummaryDTO> findAllByScriptId(Long scriptId){
        return repo.findAllByScriptId(scriptId).
                stream().map(this::toSummary).
                collect(Collectors.toList());
    }

    public List<ScriptExecutionResultSummaryDTO> getRecentExecutions(Long scriptId){
        return repo.findAllByScriptId(scriptId).
                stream().map(this::toSummary).
                limit(10).
                collect(Collectors.toList());
    }

    public ScriptExecutionMetricsDTO getAvgExecutionTime(Long scriptId){
        List<ScriptExecutionResultEntity> list = repo.findAllByScriptId(scriptId)
                .stream().limit(10).toList();


        double avgSeconds = list.stream()
                .mapToLong(e ->
                        Duration.between(e.getStartedAt(), e.getFinishedAt()).toSeconds()
                )
                .average()
                .orElse(0.0);

        Instant lastExecution = list.stream().findFirst().map(ScriptExecutionResultEntity::getReceivedAt).orElse(null);

        long successCount = list.stream()
                .filter(e -> e.getReturnCode() != null && e.getReturnCode() == 0)
                .count();

        double successRate = (successCount * 100.0) / list.size();

        return new ScriptExecutionMetricsDTO(
                scriptId,
                avgSeconds,
                lastExecution,
                successRate
        );

    }

    public long findByScriptId(Long scriptId){
        return repo.countByScriptId(scriptId);
    }

    public List<ScriptExecutionResultSummaryDTO> getExecutionHistoryBySerial(String serial) {
        return repo.findBySystemSerialNumberOrderByReceivedAtDesc(serial)
                .stream()
                .map(this::toSummary)
                .toList();
    }

    public DashboardCountsDto dashboardCounts(Long scriptId) {
        DashboardCountsView v = repo.dashboardCounts(scriptId, null, null, null, null);

        long success = v.getSuccess() == null ? 0 : v.getSuccess();
        long failed  = v.getFailed()  == null ? 0 : v.getFailed();
        long pending = countPendingSystems(scriptId);
        long total   = v.getTotal()   == null ? 0 : v.getTotal();

        return new DashboardCountsDto(success, failed, pending, total);
    }

    public long countPendingSystems(Long scriptId){
        return repo.findPendingSystems(scriptId).size();
    }


    public List<ScriptExecutionResultSummaryDTO> dashboardCountList(ExecutionResultFilterDTO f, String status) {
        Integer code = getCode(status);
            if (code==null) {
                return getPendingExecutionList(f.getScriptId());
            }
            List<ScriptExecutionResultEntity> list = repo.filterResultList(f.getScriptId(), null,
                    null, f.getFinishedAfter(),
                    f.getFinishedBefore(), code);
            return list.stream().map(this::toSummary).collect(Collectors.toList());
        }


    public List<ScriptExecutionResultSummaryDTO> getPendingExecutionList(long scriptId) {

        List<ScriptTargetSystemEntity> targetSystems = targetRepo.findAllByScriptId(scriptId);

        if (targetSystems.isEmpty()) {
            return List.of();
        }

        List<ScriptExecutionResultEntity> executedResults =
                repo.findAllByScriptId(scriptId);

        Set<String> executedSystemSet = executedResults.stream()
                .map(ScriptExecutionResultEntity::getSystemSerialNumber)
                .collect(Collectors.toSet());

        return targetSystems.stream()
                .filter(ts -> !executedSystemSet.contains(ts.getSystemSerialNumber()))
                .map(ts -> {
                    ScriptExecutionResultSummaryDTO dto = new ScriptExecutionResultSummaryDTO();

                    dto.setId(null);
                    dto.setRunUuid(null);
                    dto.setScriptId(ts.getScript().getId());
                    dto.setScriptName(ts.getScript().getName());
                    dto.setSystemSerialNumber(ts.getSystemSerialNumber());
                    dto.setStartedAt(null);
                    dto.setFinishedAt(null);
                    dto.setReturnCode(null);
                    dto.setStatus("PENDING");
                    dto.setStdout(null);
                    dto.setStderr(null);
                    dto.setHostName(ts.getHostName());
                    dto.setParsedData(null);

                    return dto;
                })
                .toList();
    }


    private Integer getCode(String status){
        if (status.equalsIgnoreCase("success")){
            return 0;
        } else if (status.equalsIgnoreCase("failed")) {
            return 1;
        }
        return null;
    }

    public DashboardSlotCountsDto getLast24HourExecutionCountsSlotted() {

        Instant overallTo = Instant.now();
        Instant overallFrom = overallTo.minus(24, ChronoUnit.HOURS);

        int slotCount = 4;//take e-one no
        long slotHours = 24 / slotCount;

        List<TimeSlotCountDto> slots = new ArrayList<>();

        Instant slotStart = overallFrom;

        for (int i = 0; i < slotCount; i++) {
            Instant slotEnd = slotStart.plus(slotHours, ChronoUnit.HOURS);

            DashboardCountsView v =
                    repo.dashboardCounts(null, null, null, slotStart, slotEnd);

            long success = v.getSuccess() == null ? 0 : v.getSuccess();
            long failed  = v.getFailed()  == null ? 0 : v.getFailed();
            long pending = v.getPending() == null ? 0 : v.getPending();
            long total   = v.getTotal()   == null ? 0 : v.getTotal();

            slots.add(new TimeSlotCountDto(slotStart, slotEnd, success, failed, pending, total));

            slotStart = slotEnd;
        }

        return new DashboardSlotCountsDto(overallFrom, overallTo, slots);
    }


}
