package com.ZioSet_WorkerConfiguration.enums;
import lombok.Getter;

@Getter
public enum ScriptTargetPlatform {
    WINDOWS_X64("Windows (x64)"),
    WINDOWS_ARM64("Windows (ARM64)"),
    MACOS_X64("macOS (x64)"),
    MACOS_ARM64("macOS (ARM64)"),
    LINUX_X64("Linux (x64)"),
    LINUX_ARM64("Linux (ARM64)"),
    ANY("Any Platform");

    private final String displayName;

    ScriptTargetPlatform(String displayName) {
        this.displayName = displayName;
    }
}

