package com.ZioSet_WorkerConfiguration.dto;

import java.time.LocalDateTime;

public record RecentInstalledDTO (
     String systemSerialNo,
     String hostName,
     String osType,
     LocalDateTime installedAt
){}
