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
public class CreateScriptArgDto {
    private String name;
    private String description;
    private Long templateId;
    private Boolean isActive;

    private List<Long> dependencyFileIds;
    private List<String> targetSystemSerials;
    private List<ScriptTargetPlatform> targetPlatforms;

    //for req_parameter_value and for script_argument_value
    private Map<String,String> params;

    private Long addedBy;

    // Schedule fields
    private ScheduleType scheduleType;
    private Instant startDateTime;
    private Long repeatEverySeconds;
    private List<String> weekDays;   // ["MON","FRI"]
    private Integer monthDay;        // 2, 10, 31
    private LocalTime timeOfDay;
}
