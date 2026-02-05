package com.ZioSet_WorkerConfiguration.controller;

import com.ZioSet_WorkerConfiguration.dto.ScriptExecutionResultSummaryDTO;
import com.ZioSet_WorkerConfiguration.dto.ScriptScheduleCountDto;
import com.ZioSet_WorkerConfiguration.service.ScriptExecutionResultService;
import com.ZioSet_WorkerConfiguration.service.ScriptService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/script-dashboard")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ScriptDashBoardController {

    private final ScriptService scriptService;
    private final ScriptExecutionResultService executionResultService;

    @GetMapping("/targetSystems-count")
    public ResponseEntity<Object> getTargetSystemsByScript() {
        return ResponseEntity.ok(
                Map.of("data",scriptService.getScriptsWithTargetCount(),
                        "Msg","Data"));
    }

    @GetMapping("/script-type-count")
    public ScriptScheduleCountDto getScheduleTypeCount() {
        return scriptService.getScriptScheduleCounts();
    }

    @GetMapping("/get-recent-executions")
    public List<ScriptExecutionResultSummaryDTO> getRecentExecutions(@RequestParam(required = false) Long scriptId) {
        return executionResultService.getRecentExecutions(scriptId);
    }

    @GetMapping("/get-avg-execution-metric")
    public ResponseEntity<Object> getAvgExecutions(@RequestParam(required = false) Long scriptId) {
        return ResponseEntity.ok(Map.of("data",executionResultService.getAvgExecutionTime(scriptId),
                                        "message","data"));
    }
}



