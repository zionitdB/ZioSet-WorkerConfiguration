package com.ZioSet_WorkerConfiguration.parsing;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ExecutionParseRequest {

    private JsonNode stdout;
    private JsonNode stderr;
    private JsonNode parsingTemplate;
}

