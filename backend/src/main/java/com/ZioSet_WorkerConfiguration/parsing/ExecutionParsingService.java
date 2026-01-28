package com.ZioSet_WorkerConfiguration.parsing;

import com.ZioSet_WorkerConfiguration.model.ScriptTemplateEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ExecutionParsingService {

    private final JsonExecutionResultParsingEngine parsingEngine;

    public ParsedExecutionResult parse(ExecutionParseRequest request) {

        // Raw execution result
        RawExecutionResult rawResult = new RawExecutionResult(
                request.getStdout().toString(),
                request.getStderr().toString()
        );
        System.out.println("Raw\n"+rawResult);

        ScriptTemplateEntity template = new ScriptTemplateEntity();

        template.setParsingTemplate(request.getParsingTemplate().asText());

        return parsingEngine.parse(rawResult, template);
    }
}
