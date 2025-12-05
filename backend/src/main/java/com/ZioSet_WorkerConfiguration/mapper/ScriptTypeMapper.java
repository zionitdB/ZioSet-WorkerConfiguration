package com.ZioSet_WorkerConfiguration.mapper;

import com.ZioSet_WorkerConfiguration.dto.ScriptTypeResponseDTO;
import com.ZioSet_WorkerConfiguration.model.ScriptType;

import java.util.List;

public class ScriptTypeMapper {

    public static ScriptTypeResponseDTO map(ScriptType type) {

        return switch (type) {
            case INLINE_CMD -> new ScriptTypeResponseDTO(
                    type.name(),
                    "CMD Inline Script",
                    "TEXT",
                    null
            );
            case INLINE_POWERSHELL -> new ScriptTypeResponseDTO(
                    type.name(),
                    "PowerShell Inline Script",
                    "TEXT",
                    null
            );
            case INLINE_BASH -> new ScriptTypeResponseDTO(
                    type.name(),
                    "Bash Inline Script",
                    "TEXT",
                    null
            );
            case FILE_PS1 -> new ScriptTypeResponseDTO(
                    type.name(),
                    "PowerShell Script (.ps1)",
                    "FILE",
                    List.of(".ps1")
            );
            case FILE_BAT -> new ScriptTypeResponseDTO(
                    type.name(),
                    "Batch Script (.bat)",
                    "FILE",
                    List.of(".bat")
            );
            case FILE_SH -> new ScriptTypeResponseDTO(
                    type.name(),
                    "Shell Script (.sh)",
                    "FILE",
                    List.of(".sh")
            );
            case FILE_EXE -> new ScriptTypeResponseDTO(
                    type.name(),
                    "Executable File (.exe)",
                    "FILE",
                    List.of(".exe")
            );
            default -> throw new IllegalArgumentException("Unknown script type: " + type);
        };
    }
}
