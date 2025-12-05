package com.ZioSet_WorkerConfiguration.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ScriptTypeResponseDTO {

    private String enumName;       // INLINE_CMD
    private String displayName;    // "CMD Inline Script"
    private String category;       // "TEXT" or "FILE"
    private List<String> extensions; // null for TEXT
}
