package com.ZioSet_WorkerConfiguration.dto;

import java.time.Instant;

public record TimeSlotCountDto(
         Instant from,
         Instant to,
         long success,
         long failed,
         long pending,
         long total) {
}
