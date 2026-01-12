package com.ZioSet_WorkerConfiguration.controller;

import com.ZioSet_WorkerConfiguration.dto.CreateScriptTemplateRequest;
import com.ZioSet_WorkerConfiguration.service.ScriptService;
import com.ZioSet_WorkerConfiguration.service.ScriptTemplateService;
import com.ZioSet_WorkerConfiguration.utils.ResponseGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping("/script-template")
@RequiredArgsConstructor
public class ScriptTemplateController {

    private final ScriptTemplateService scriptTemplateService;

    @PostMapping
    public ResponseEntity<?> createOrUpdateScriptTemplate(@RequestBody CreateScriptTemplateRequest request) {
        return ResponseGenerator.generate("Template Created!", HttpStatus.OK,
                scriptTemplateService.createOrUpdateTemplate(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTemplate(@PathVariable Long id) {
        scriptTemplateService.deactivate(id);
        return ResponseGenerator.generate("Template Deleted!", HttpStatus.OK, null);
    }

    @GetMapping
    public ResponseEntity<?> listTemplates(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseGenerator.generate("Template List", HttpStatus.OK,
                scriptTemplateService.list(page, size));
    }


}
