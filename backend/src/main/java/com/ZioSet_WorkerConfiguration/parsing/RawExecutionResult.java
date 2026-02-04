package com.ZioSet_WorkerConfiguration.parsing;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RawExecutionResult {
    private String stdoutJson;
    private String stderrJson;
}

