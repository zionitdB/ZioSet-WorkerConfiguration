package com.ZioSet_WorkerConfiguration.controller;

import com.ZioSet_WorkerConfiguration.service.AgentConfigurationDashBoardService;
import com.ZioSet_WorkerConfiguration.utils.ResponseGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin("*")
@RequestMapping("/agent-config-dashboard")
@RequiredArgsConstructor
public class AgentConfigurationDashBoardController {

    private final AgentConfigurationDashBoardService dashBoardService;
    @GetMapping("/count")
    public ResponseEntity<Object> getAllCount() {
        var count= dashBoardService.getDashboardCount();
        return ResponseGenerator.generateResponse("Count Data", HttpStatus.OK, count);
    }

}
