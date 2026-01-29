package com.ZioSet_WorkerConfiguration.controller;

import com.ZioSet_WorkerConfiguration.service.ScriptService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/script-dashboard")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ScriptDashBoardController {

    private final ScriptService scriptService;

    @GetMapping("/targetSystems")
    public ResponseEntity<Object> getTargetSystemsByScript() {
        return ResponseEntity.ok(
                Map.of("data",scriptService.getScriptsWithTargetCount(),
                        "Msg","Data"));
    }
}



