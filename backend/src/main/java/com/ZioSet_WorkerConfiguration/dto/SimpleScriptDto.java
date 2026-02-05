package com.ZioSet_WorkerConfiguration.dto;

import com.ZioSet_WorkerConfiguration.enums.ScriptTargetPlatform;
import com.ZioSet_WorkerConfiguration.model.ScheduleType;
import com.ZioSet_WorkerConfiguration.model.ScriptType;
import lombok.Data;

import java.time.Instant;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@Data
public class SimpleScriptDto {
    private String name;
    private String description;
    private ScriptType scriptType;
    private String scriptText;
    private Long scriptFileId;
    private Boolean isActive;

    private List<Long> dependencyFileIds;
    private List<TargetSystemDto> serialNoHostName;
    private List<ScriptTargetPlatform> targetPlatforms;

    // Schedule fields
    private ScheduleType scheduleType;
    private Instant startDateTime;
    private Long repeatEverySeconds;
    private List<String> weekDays;
    private Integer monthDay;

    //TODO("check in python backend if it is used")
    private LocalTime timeOfDay;

    private Map<String,String> params;
    private String format;
    private Long addedBy;
}
