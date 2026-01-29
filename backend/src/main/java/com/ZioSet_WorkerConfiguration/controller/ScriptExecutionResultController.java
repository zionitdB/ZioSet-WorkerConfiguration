package com.ZioSet_WorkerConfiguration.controller;

import com.ZioSet_WorkerConfiguration.dto.DashboardCountsDto;
import com.ZioSet_WorkerConfiguration.dto.ExecutionResultFilterDTO;
import com.ZioSet_WorkerConfiguration.dto.ResponceObj;
import com.ZioSet_WorkerConfiguration.dto.ScriptExecutionResultSummaryDTO;
import com.ZioSet_WorkerConfiguration.service.ScriptExecutionResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/execution-results")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ScriptExecutionResultController {

    private final ScriptExecutionResultService service;

    @GetMapping
    public Page<ScriptExecutionResultSummaryDTO> getResults(
            @ModelAttribute ExecutionResultFilterDTO filter,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        System.out.println("scriptId=" + filter.getScriptId()
                + ", after=" + filter.getFinishedAfter()
                + ", before=" + filter.getFinishedBefore());
        return service.getPaginatedResults(filter, page, size);
    }

    @GetMapping("/getAllByScriptId")
    public List<ScriptExecutionResultSummaryDTO> findAllByScriptId(@RequestParam Long scriptId    ) {
        return service.findAllByScriptId(scriptId);
    }

    @GetMapping("/getCountByScriptId")
    public ResponceObj getResults(@RequestParam Long scriptId) {
        long count = service.findByScriptId(scriptId);
        ResponceObj obj = new ResponceObj();
        obj.setData(count);
        obj.setCode(200);
        obj.setMessage("data");
        return obj;
    }

    @GetMapping("/getSummaryBySerialNo")
    public List<ScriptExecutionResultSummaryDTO> getSummaryBySerialNo(@RequestParam String serialNo) {
        return service.getExecutionHistoryBySerial(serialNo);
    }

    @GetMapping("/dashboard-counts")
    public DashboardCountsDto dashboardCounts(@RequestParam(required = false)Long scriptId) {
        return service.dashboardCounts(scriptId);
    }

    @GetMapping("/dashboard-statuswise")
    public ResponseEntity<Object> dashboardStatusList(@ModelAttribute ExecutionResultFilterDTO filter,
                                                  @RequestParam String status) {
        return ResponseEntity.ok(
                Map.of(
                        "data", service.dashboardCountList(filter,status),
                        "message", "Data"
                )
        );

    }

    @GetMapping("/parsed-report")
    public ResponseEntity<Object> paredReport( @ModelAttribute ExecutionResultFilterDTO filter,
                                               @RequestParam(defaultValue = "1") int page,
                                               @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(service.parse(filter,page,size));
    }

    @GetMapping("/last-24-hours-count")
    public ResponseEntity<?> getLast24HourSlotCounts() {

        return ResponseEntity.ok(
                Map.of(
                        "data", service.getLast24HourExecutionCountsSlotted(),
                        "message", "Last 24 hours execution counts"
                )
        );
    }
}
