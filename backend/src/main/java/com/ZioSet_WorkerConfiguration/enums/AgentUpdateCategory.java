package com.ZioSet_WorkerConfiguration.enums;

public enum AgentUpdateCategory {
    PLUGIN("Plugin"),
    PROCESS("Process"),
    STORE("Store"),
    WORKS("Works");
    AgentUpdateCategory(String value) {
        this.value = value;
    }

    private final String value;

    public String getValue() {
        return value;
    }
}
