package com.ZioSet_WorkerConfiguration.dto;

import java.time.Instant;
import java.util.List;

public record DashboardSlotCountsDto(
        Instant overallFrom,
        Instant overallTo,
        List<TimeSlotCountDto> slots
) {
}
