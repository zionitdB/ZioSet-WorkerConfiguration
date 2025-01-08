package com.ZioSet_WorkerConfiguration.enums;

public enum AgentUpdateType {
    STORE("Store"),
    WORKS("Works");

    AgentUpdateType(String value) {
        this.value = value;
    }

    private final String value;

    public String getValue() {
        return value;
    }
}
