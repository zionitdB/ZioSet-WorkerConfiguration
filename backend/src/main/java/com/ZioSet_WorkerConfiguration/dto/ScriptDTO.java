package com.ZioSet_WorkerConfiguration.dto;

import com.ZioSet_WorkerConfiguration.model.ScheduleType;
import com.ZioSet_WorkerConfiguration.model.ScriptType;
import lombok.Data;

import java.time.Instant;
import java.time.LocalTime;
import java.util.List;

@Data
public class ScriptDTO {
    private Long id;
    private String name;
    private String description;
    private ScriptType scriptType;
    private String scriptText;
    private Long scriptFileId;
    private Boolean isActive;

    private List<Long> dependencyFileIds;
    private List<String> targetSystemSerials;

    // Schedule fields
    private ScheduleType scheduleType;
    private Instant startDateTime;
    private Long repeatEverySeconds;
    private List<String> weekDays;   // ["MON","FRI"]
    private Integer monthDay;        // 2, 10, 31
    private LocalTime timeOfDay;        // "09:00"
}

