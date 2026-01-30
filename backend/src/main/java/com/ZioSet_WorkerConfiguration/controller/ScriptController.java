package com.ZioSet_WorkerConfiguration.controller;

import com.ZioSet_WorkerConfiguration.dto.*;
import com.ZioSet_WorkerConfiguration.enums.ScriptTargetPlatform;
import com.ZioSet_WorkerConfiguration.mapper.ScriptTypeMapper;
import com.ZioSet_WorkerConfiguration.model.*;
import com.ZioSet_WorkerConfiguration.service.ScriptService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
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
        return scriptService.createOrUpdateScriptExecution(dto);
    }

    @PostMapping("/create")
    public ScriptEntity create(@RequestBody CreateScriptArgDto dto) {
        return scriptService.createScriptArgDto(dto);
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
    public List<ScriptTargetSystemResponseDTO> getTargetSystemsById(@PathVariable Long id) {
        return scriptService.getScriptTargetSystems(id);
    }

    @GetMapping("/{id}/targetSystemsPagination")
    public Page<ScriptTargetSystemResponseDTO> getTargetSystemsByIdPagination(@PathVariable Long id,  @RequestParam(value = "pageNo", defaultValue = "1") int pageNo, @RequestParam(value = "perPage", defaultValue = "10") int perPage) {
        return scriptService.getScriptTargetSystemsPagination(id, pageNo, perPage);
    }

    @PostMapping({"/getAllScriptEntityByLimitAndGroupSearch"})
    public List<ScriptEntity> getAllScriptEntityByLimitAndGroupSearch(@RequestBody GroupSearchDTO groupSearchDTO) {
        List<ScriptEntity> list = new ArrayList<>();
        try {
            list = this.scriptService.getAllScriptEntityByLimitAndGroupSearch(groupSearchDTO);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    @PostMapping({"/getCountAllScriptEntityByLimitAndGroupSearch"})
    public int getCountAllScriptEntityByLimitAndGroupSearch(@RequestBody GroupSearchDTO groupSearchDTO) {
        int count = 0;
        try {
            count = this.scriptService.getCountAllScriptEntityByLimitAndGroupSearch(groupSearchDTO);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return count;
    }

    @GetMapping({"/getScriptEntityByLimit"})
    public List<ScriptEntity> getScriptEntitySystemByLimit(@RequestParam int pageNo, @RequestParam int perPage) {
        List<ScriptEntity> list = new ArrayList<>();
        try {
            list = this.scriptService.getScriptEntityByLimit(pageNo, perPage);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    @PostMapping({"/getAllScriptTargetSystemByLimitAndGroupSearch"})
    public List<ScriptTargetSystemEntity> getAllScriptTargetSystemEntityByLimitAndGroupSearch(@RequestBody GroupSearchDTO groupSearchDTO) {
        List<ScriptTargetSystemEntity> list = new ArrayList<>();
        try {
            list = scriptService.getAllScriptTargetSystemByLimitAndGroupSearch(groupSearchDTO);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    @PostMapping({"/getCountAllScriptTargetSystemByLimitAndGroupSearch"})
    public int getCountAllScriptTargetSystemByLimitAndGroupSearch(@RequestBody GroupSearchDTO groupSearchDTO) {
        int count = 0;
        try {
            count = scriptService.getCountAllScriptTargetSystemByLimitAndGroupSearch(groupSearchDTO);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return count;
    }

    @GetMapping({"/getScriptTargetSystemByLimit"})
    public List<ScriptTargetSystemEntity> getScriptEntityByLimit(@RequestParam int pageNo, @RequestParam int perPage) {
        List<ScriptTargetSystemEntity> list = new ArrayList<>();
        try {
            list = scriptService.getScriptTargetSystemByLimit(pageNo, perPage);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    @GetMapping({"/count"})
    public long getScriptEntityCount() {
        long count = 0;
        try {
            count = scriptService.getScriptCount();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return count;
    }


    @GetMapping("/pending")
    public ResponseEntity<?> pending(@RequestParam(defaultValue = "1") int page,
                                     @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page-1,size);
        return ResponseEntity.ok(
                Map.of(
                        "data", scriptService.getPendingScripts(pageable),
                        "message", "Pending scripts"
                )
        );
    }

    @GetMapping("/approved")
    public ResponseEntity<?> approved(@RequestParam(defaultValue = "1") int page,
                                      @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page-1,size);
        return ResponseEntity.ok(
                Map.of(
                        "data", scriptService.getApprovedScripts(pageable),
                        "message", "Approved scripts"
                )
        );
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approve(@PathVariable Long id) {
        scriptService.approveScript(id);
        return ResponseEntity.ok(Map.of("message", "Script approved"));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<?> reject(@PathVariable Long id) {
        scriptService.rejectScript(id);
        return ResponseEntity.ok(Map.of("message", "Script rejected"));
    }


    @GetMapping("/with-parsing-rule")
    public ResponseEntity<?> getScriptsWithParsingRules(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        Pageable pageable = PageRequest.of(page, size);

        return ResponseEntity.ok(
                Map.of(
                        "data", scriptService.getScriptsWithParsingRules(pageable),
                        "message", "Scripts with parsing rules"
                )
        );
    }


}
