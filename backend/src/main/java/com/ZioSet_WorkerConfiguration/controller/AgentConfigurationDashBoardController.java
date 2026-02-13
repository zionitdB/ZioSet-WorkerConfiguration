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

    @GetMapping("/action-count-per-category")
    public ResponseEntity<?> getActionCountPerCategory() {
        return ResponseGenerator.generateResponse("Action count per category Data", HttpStatus.OK,
                dashBoardService.getActionCountPerCategory());
    }

    @GetMapping("/action-count-per-category-subcategory")
    public ResponseEntity<?> getActionCountPerCategoryAndSubCategory() {
        return ResponseGenerator.generateResponse("Action count per category-sub category Data", HttpStatus.OK,
                dashBoardService.getActionCountPerCategoryAndSubCategory());
    }

    @GetMapping("/get-commands")
    public ResponseEntity<?> getCommands() {
        return ResponseGenerator.generateResponse("Command Data", HttpStatus.OK,
                dashBoardService.getCommandData());
    }

    @GetMapping("/get-command-count-per-action")
    public ResponseEntity<?> getCommandCountPerAction() {
        return ResponseGenerator.generateResponse("Command Count Per ActionData", HttpStatus.OK,
                dashBoardService.getCommandCountPerAction());
    }

    @GetMapping("/standAlone-count")
    public ResponseEntity<?> getStandAloneCount() {
        return ResponseGenerator.generateResponse("Stand Alone count", HttpStatus.OK,
                dashBoardService.getStandAloneCount());
    }


}
