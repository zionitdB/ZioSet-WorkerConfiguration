package com.ZioSet_WorkerConfiguration.controller;

import com.ZioSet_WorkerConfiguration.dto.ScriptDTO;
import com.ZioSet_WorkerConfiguration.dto.ScriptTypeResponseDTO;
import com.ZioSet_WorkerConfiguration.enums.ScriptTargetPlatform;
import com.ZioSet_WorkerConfiguration.mapper.ScriptTypeMapper;
import com.ZioSet_WorkerConfiguration.model.ScriptEntity;
import com.ZioSet_WorkerConfiguration.model.ScriptType;
import com.ZioSet_WorkerConfiguration.service.ScriptService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

@RestController
@RequestMapping("/api/scripts")
@RequiredArgsConstructor
@CrossOrigin("*")
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

    @PatchMapping("/{id}/enable")
    public ScriptEntity enable(@PathVariable Long id) {
        return scriptService.setScriptActive(id, true);
    }

    @PatchMapping("/{id}/disable")
    public ScriptEntity disable(@PathVariable Long id) {
        return scriptService.setScriptActive(id, false);
    }


    @GetMapping("/types")
    public List<ScriptTypeResponseDTO> getScriptTypes() {
        return Stream.of(ScriptType.values())
                .map(ScriptTypeMapper::map)
                .toList();
    }

    @GetMapping("/platforms")
    public List<Map<String, String>> getScriptPlatformsTypes() {
        return Stream.of(ScriptTargetPlatform.values())
                .map(p -> Map.of(
                        "enumName", p.name(),
                        "displayName", p.getDisplayName()
                ))
                .toList();
    }

    @GetMapping("/{id}/targetSystems")
    public ScriptEntity getTargetSystemsById(@PathVariable Long id) {
        return scriptService.getScript(id).orElseThrow(() -> new RuntimeException("Script not found"));
    }

}
