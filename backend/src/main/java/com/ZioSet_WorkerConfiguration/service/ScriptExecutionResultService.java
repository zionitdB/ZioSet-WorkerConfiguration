package com.ZioSet_WorkerConfiguration.service;

import com.ZioSet_WorkerConfiguration.dto.DashboardCountsDto;
import com.ZioSet_WorkerConfiguration.dto.DashboardCountsView;
import com.ZioSet_WorkerConfiguration.dto.ExecutionResultFilterDTO;
import com.ZioSet_WorkerConfiguration.dto.ScriptExecutionResultSummaryDTO;
import com.ZioSet_WorkerConfiguration.model.ScriptExecutionResultEntity;
import com.ZioSet_WorkerConfiguration.model.ScriptTemplateEntity;
import com.ZioSet_WorkerConfiguration.parsing.ExecutionParseRequest;
import com.ZioSet_WorkerConfiguration.parsing.JsonExecutionResultParsingEngine;
import com.ZioSet_WorkerConfiguration.parsing.ParsedExecutionResult;
import com.ZioSet_WorkerConfiguration.parsing.RawExecutionResult;
import com.ZioSet_WorkerConfiguration.repo.ScriptExecutionResultRepository;
import com.ZioSet_WorkerConfiguration.utils.PagedResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ScriptExecutionResultService {

    private final ScriptExecutionResultRepository repo;
    private final JsonExecutionResultParsingEngine parsingEngine;

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

    public long findByScriptId(Long scriptId){
        return repo.countByScriptId(scriptId);
    }

    public List<ScriptExecutionResultSummaryDTO> getExecutionHistoryBySerial(String serial) {
        return repo.findBySystemSerialNumberOrderByReceivedAtDesc(serial)
                .stream()
                .map(this::toSummary)
                .toList();
    }

    public DashboardCountsDto dashboardCounts(ExecutionResultFilterDTO f) {
        DashboardCountsView v = repo.dashboardCounts(f.getScriptId(), f.getSerialNumber(),
                f.getHostName(), f.getFinishedAfter(),
                f.getFinishedBefore());

        long success = v.getSuccess() == null ? 0 : v.getSuccess();
        long failed  = v.getFailed()  == null ? 0 : v.getFailed();
        long pending = v.getPending() == null ? 0 : v.getPending();
        long total   = v.getTotal()   == null ? 0 : v.getTotal();

        return new DashboardCountsDto(success, failed, pending, total);
    }


}
