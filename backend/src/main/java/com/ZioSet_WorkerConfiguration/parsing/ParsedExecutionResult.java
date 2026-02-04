package com.ZioSet_WorkerConfiguration.parsing;

import com.ZioSet_WorkerConfiguration.parsing.enums.ExecutionStatus;
import lombok.Data;

import java.util.HashMap;
import java.util.Map;

@Data
public class ParsedExecutionResult {
    private ExecutionStatus status;
    private Map<String, Object> fields = new HashMap<>();
}
