package com.ZioSet_WorkerConfiguration.controller;

import com.ZioSet_WorkerConfiguration.model.ScriptFileEntity;
import com.ZioSet_WorkerConfiguration.service.ScriptFileService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/script-files")
@RequiredArgsConstructor
public class ScriptFileController {

    private final ScriptFileService scriptFileService;

    @PostMapping("/upload")
    public ScriptFileEntity uploadFile(@RequestParam("file") MultipartFile file,
                                       @RequestParam("uploadedBy") String uploadedBy) throws Exception {
        return scriptFileService.uploadFile(file, uploadedBy);
    }
}
