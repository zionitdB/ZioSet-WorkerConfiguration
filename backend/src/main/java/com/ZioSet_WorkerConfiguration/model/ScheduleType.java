package com.ZioSet_WorkerConfiguration.model;

public enum ScheduleType {
    NONE,
    ONE_TIME,
    REPEAT_EVERY,     // seconds
    WEEKLY,           // days of week (MON, FRI)
    MONTHLY           // date of month (2nd, 10th, 25th...)
}
