package com.ZioSet_WorkerConfiguration.parsing;

import com.ZioSet_WorkerConfiguration.parsing.enums.OutputType;
import lombok.Data;

import java.util.List;

@Data
public class ParsingDefinition {
    private int version;
    private Criteria successCriteria;
    private Criteria failureCriteria;
    private List<ParsingField> fields;
    private OutputType outputType;
}
