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

    @GetMapping("/agent-last7days-count")
    public ResponseEntity<?> getLast7DaysDashboard() {
        return ResponseGenerator.generateResponse("last 7 days count", HttpStatus.OK,
                dashBoardService.getLast7DaysDashboard());
    }

    @GetMapping("/overall-count")
    public ResponseEntity<?> getOverallDashboard() {
        return ResponseGenerator.generateResponse("Agent OverAll", HttpStatus.OK,
                dashBoardService.getOverallDashboard());
    }

    @GetMapping("/recent-agent-updates")
    public ResponseEntity<?> getRecentUpdates() {
        return ResponseGenerator.generateResponse("Agent updates data", HttpStatus.OK,
                dashBoardService.getLatestUpdateData());
    }

    @GetMapping("/recent-agent-installation-systems")
    public ResponseEntity<?> getRecentInstallationSystem() {
        return ResponseGenerator.generateResponse("Recent Agent Installation Systems data", HttpStatus.OK,
                dashBoardService.getRecentInstalledCombined());
    }

}
