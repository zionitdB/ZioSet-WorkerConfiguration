package com.ZioSet_WorkerConfiguration.controller;

import com.ZioSet_WorkerConfiguration.dto.ExecutionResultFilterDTO;
import com.ZioSet_WorkerConfiguration.dto.ResponceObj;
import com.ZioSet_WorkerConfiguration.dto.ScriptExecutionResultSummaryDTO;
import com.ZioSet_WorkerConfiguration.service.ScriptExecutionResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}
