package com.ZioSet_WorkerConfiguration.parsing;

import com.ZioSet_WorkerConfiguration.model.ScriptTemplateEntity;
import com.ZioSet_WorkerConfiguration.parsing.enums.ExecutionStatus;
import com.ZioSet_WorkerConfiguration.parsing.enums.FieldType;
import com.ZioSet_WorkerConfiguration.parsing.enums.OutputType;
import com.ZioSet_WorkerConfiguration.parsing.enums.SourceType;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.jayway.jsonpath.Configuration;


import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class JsonExecutionResultParsingEngine {

    private final ObjectMapper objectMapper;

    public ParsedExecutionResult parse(
            RawExecutionResult raw,
            String parsingFormat) {
        System.out.println("In main parse \n");

        ParsingDefinition template = readTemplate(parsingFormat);


//        if (template.getOutputType() != OutputType.JSON) {
//            throw new IllegalStateException("Only JSON outputType is supported");
//        }

        ParsedExecutionResult result = new ParsedExecutionResult();

        Object stdoutDoc = parseJsonSafe(raw.getStdoutJson(), "STDOUT", result);
        Object stderrDoc = parseJsonSafe(raw.getStderrJson(), "STDERR", result);

        ExecutionStatus status = evaluateStatus(template, stdoutDoc, stderrDoc, result);
        result.setStatus(status);

        extractFields(template, stdoutDoc, stderrDoc, result);

        return result;
    }


    private ExecutionStatus evaluateStatus(
            ParsingDefinition template,
            Object stdoutDoc,
            Object stderrDoc,
            ParsedExecutionResult result) {

        System.out.println("In Evaluate Status\n");
        if (template.getFailureCriteria() != null) {
            if (evaluateCriteria(template.getFailureCriteria(), stdoutDoc, stderrDoc)) {
                return ExecutionStatus.FAILED;
            }
        }

        if (template.getSuccessCriteria() != null) {
            if (evaluateCriteria(template.getSuccessCriteria(), stdoutDoc, stderrDoc)) {
                return ExecutionStatus.SUCCESS;
            }
        }

        return ExecutionStatus.UNKNOWN;
    }

    private boolean evaluateCriteria(
            Criteria criteria,
            Object stdoutDoc,
            Object stderrDoc) {

        Object doc = criteria.getSource() == SourceType.STDOUT ? stdoutDoc : stderrDoc;

        System.out.println("In criteria evaluate\n");
        try {
            Object value = JsonPath.read(doc, criteria.getJsonPath());

            if (criteria.getEquals() != null) {
                return value != null && criteria.getEquals().equals(value.toString());
            }

            if (criteria.getExists() != null) {
                return criteria.getExists() && value != null;
            }

        } catch (Exception e) {
            return false;
        }

        return false;
    }

    private void extractFields(
            ParsingDefinition template,
            Object stdoutDoc,
            Object stderrDoc,
            ParsedExecutionResult result) {

        for (ParsingField field : template.getFields()) {

            Object doc = field.getSource() == SourceType.STDOUT ? stdoutDoc : stderrDoc;

            try {
                Object value = JsonPath.read(doc, field.getJsonPath());
                Object casted = cast(value, field.getType());
                result.getFields().put(field.getName(), casted);

            } catch (Exception e) {

            }
        }
        System.out.println("In extract fields\n");

    }
    private ParsingDefinition readTemplate(String json) {
        try {
            return objectMapper.readValue(json, ParsingDefinition.class);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid parsingTemplate JSON", e);
        }
    }

    private Object parseJsonSafe(String json, String source, ParsedExecutionResult result) {
        try {
            System.out.println("In parse json\n"+json);
            return Configuration.defaultConfiguration()
                    .jsonProvider()
                    .parse(json);
        } catch (Exception e) {
//            result.getWarnings().add("Invalid JSON in " + source);
            return new HashMap<>();
        }
    }

    private Object cast(Object value, FieldType type) {
        if (value == null) return null;
        System.out.println("In cast\n"+value);
        return switch (type) {
            case STRING -> value.toString();
            case INT -> Integer.parseInt(value.toString());
            case BOOLEAN -> Boolean.parseBoolean(value.toString());
            case DOUBLE -> Double.parseDouble(value.toString());
        };
    }
}

