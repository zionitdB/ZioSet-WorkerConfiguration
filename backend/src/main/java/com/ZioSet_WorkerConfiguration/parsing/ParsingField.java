package com.ZioSet_WorkerConfiguration.parsing;

import com.ZioSet_WorkerConfiguration.parsing.enums.FieldType;
import com.ZioSet_WorkerConfiguration.parsing.enums.SourceType;
import lombok.Data;

@Data
public class ParsingField {
    private String name;
    private SourceType source;
    private FieldType type;
    private String jsonPath;
}
