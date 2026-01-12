package com.ZioSet_WorkerConfiguration.dto;

import com.ZioSet_WorkerConfiguration.enums.ScriptTargetPlatform;
import com.ZioSet_WorkerConfiguration.model.ScriptTargetSystemEntity;
import com.ZioSet_WorkerConfiguration.model.ScriptType;

import java.util.List;

public record CreateScriptTemplateRequest (
        Long id,
        String name,
        String description,
        ScriptType scriptType,
        Long scriptFileId,
        List<Long> dependencyFileIds,
        List<ScriptTargetPlatform> targetPlatforms,
        Boolean active){
}
