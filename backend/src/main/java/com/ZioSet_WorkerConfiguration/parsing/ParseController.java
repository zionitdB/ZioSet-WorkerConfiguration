package com.ZioSet_WorkerConfiguration.parsing;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/parse")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ParseController {

    private final ExecutionParsingService parsingService;

    @PostMapping("/parse")
    public ResponseEntity<ParsedExecutionResult> parseExecutionResult(
            @Valid @RequestBody ExecutionParseRequest request) {
        ParsedExecutionResult result = parsingService.parse(request);
        return ResponseEntity.ok(result);
    }
}
