package com.ZioSet_WorkerConfiguration.dto;

import com.ZioSet_WorkerConfiguration.enums.ScriptTargetPlatform;
import com.ZioSet_WorkerConfiguration.model.ScriptType;

import java.util.List;
import java.util.Map;

public record CreateScriptTemplateRequest (
        Long id,
        String name,
        String description,
        ScriptType scriptType,
        Long scriptFileId,
        List<Long> dependencyFileIds,
        List<ScriptTargetPlatform> targetPlatforms,
        Map<String, String> requiredParameters,
        Boolean active){
}
