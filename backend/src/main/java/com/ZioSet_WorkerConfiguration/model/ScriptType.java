package com.ZioSet_WorkerConfiguration.model;

// ScriptType enum
public enum ScriptType {
    INLINE_CMD,       // Windows CMD text command
    INLINE_POWERSHELL,// PowerShell text command
    INLINE_BASH,      // Bash text command
    FILE_PS1,         // PowerShell script file (.ps1)
    FILE_BAT,         // Batch file (.bat)
    FILE_SH,          // Shell script file (.sh)
    FILE_EXE          // Executable file (.exe)
}