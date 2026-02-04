package com.ZioSet_WorkerConfiguration.parsing;

import com.ZioSet_WorkerConfiguration.parsing.enums.SourceType;
import lombok.Data;


@Data
public class Criteria {
    private SourceType source;
    private String jsonPath;

    private String equals;
    private Boolean exists;
}
