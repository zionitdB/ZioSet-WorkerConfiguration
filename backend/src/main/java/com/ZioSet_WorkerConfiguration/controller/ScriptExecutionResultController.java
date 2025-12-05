package com.ZioSet_WorkerConfiguration.controller;

import com.ZioSet_WorkerConfiguration.dto.ExecutionResultFilterDTO;
import com.ZioSet_WorkerConfiguration.dto.ScriptExecutionResultSummaryDTO;
import com.ZioSet_WorkerConfiguration.service.ScriptExecutionResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/execution-results")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ScriptExecutionResultController {

    private final ScriptExecutionResultService service;

    @GetMapping
    public Page<ScriptExecutionResultSummaryDTO> getResults(
            ExecutionResultFilterDTO filter,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return service.getPaginatedResults(filter, page, size);
    }
}
