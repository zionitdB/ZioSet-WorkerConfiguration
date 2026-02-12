package com.ZioSet_WorkerConfiguration.controller;

import com.ZioSet_WorkerConfiguration.service.AgentDashBoardService;
import com.ZioSet_WorkerConfiguration.utils.ResponseGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping("/agent-dashboard")
@RequiredArgsConstructor
public class AgentDashBoardController {

    private final AgentDashBoardService dashBoardService;

    @GetMapping("/count")
    public ResponseEntity<Object> getAllCount() {
        var count= dashBoardService.getSystemsCount();
        return ResponseGenerator.generateResponse("Count Data", HttpStatus.OK, count);
    }

    @GetMapping("/today's-count")
    public ResponseEntity<Object> getAllTodayCount() {
        var count= dashBoardService.getAllTodayCount();
        return ResponseGenerator.generateResponse("Today's Count Data", HttpStatus.OK, count);
    }

    @GetMapping("/agent-update-count")
    public ResponseEntity<?> getAgentUpdatesCount() {
        return ResponseGenerator.generateResponse("Update Count", HttpStatus.OK,
                dashBoardService.getAgentUpdatesCount());
    }

    @GetMapping("/today's-agent-update-count")
    public ResponseEntity<?> getTodayAgentUpdatesCount() {
        return ResponseGenerator.generateResponse("Today's Update Count", HttpStatus.OK,
                dashBoardService.getAgentUpdateTodayCount());
    }

    @GetMapping("/last-10-days-count")
    public ResponseEntity<?> getLast10DaysInstalledCount() {
        return ResponseGenerator.generateResponse("Last 10 days count", HttpStatus.OK,
                dashBoardService.getLast10DaysInstalledCount());
    }

    @GetMapping("/weekly-count")
    public ResponseEntity<?> getWeeklyInstalledCount(@RequestParam int month, @RequestParam int year) {
        return ResponseGenerator.generateResponse("Weekly count", HttpStatus.OK,
                dashBoardService.getWeeklyInstalledCount(year,month));
    }

}
