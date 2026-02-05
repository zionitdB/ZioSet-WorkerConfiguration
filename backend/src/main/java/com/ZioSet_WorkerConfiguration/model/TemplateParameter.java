package com.ZioSet_WorkerConfiguration.model;

import com.ZioSet_WorkerConfiguration.enums.ParamType;
import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class TemplateParameter {
    private String paramName;
    private ParamType paramType;
    private boolean required;
    private String defaultValue;
}
