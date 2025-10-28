package com.ZioSet_WorkerConfiguration.controller;

import com.ZioSet_WorkerConfiguration.dto.ScriptDTO;
import com.ZioSet_WorkerConfiguration.model.ScriptEntity;
import com.ZioSet_WorkerConfiguration.service.ScriptService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/scripts")
@RequiredArgsConstructor
public class ScriptController {

    private final ScriptService scriptService;

    @PostMapping
    public ScriptEntity createOrUpdate(@RequestBody ScriptDTO dto) {
        return scriptService.createOrUpdateScript(dto);
    }

    @GetMapping
    public List<ScriptEntity> getAll() {
        return scriptService.getAllScripts();
    }

    @GetMapping("/{id}")
    public ScriptEntity getById(@PathVariable Long id) {
        return scriptService.getScript(id).orElseThrow(() -> new RuntimeException("Script not found"));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        scriptService.deleteScript(id);
    }
}
