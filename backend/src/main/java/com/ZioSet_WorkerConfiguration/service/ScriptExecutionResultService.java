package com.ZioSet_WorkerConfiguration.service;

import com.ZioSet_WorkerConfiguration.dto.ExecutionResultFilterDTO;
import com.ZioSet_WorkerConfiguration.dto.ScriptExecutionResultSummaryDTO;
import com.ZioSet_WorkerConfiguration.model.ScriptExecutionResultEntity;
import com.ZioSet_WorkerConfiguration.repo.ScriptExecutionResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ScriptExecutionResultService {

    private final ScriptExecutionResultRepository repo;

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
        dto.setStdout(e.getStdout());
        dto.setStderr(e.getStderr());
        dto.setHostName(e.getHostName());
        return dto;
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


}
