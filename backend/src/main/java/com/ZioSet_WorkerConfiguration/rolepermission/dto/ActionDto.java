package com.ZioSet_WorkerConfiguration.rolepermission.dto;

public class ActionDto {
    private String actionName;

    private boolean selected;

    public String getActionName() {
        return this.actionName;
    }

    public void setActionName(String actionName) {
        this.actionName = actionName;
    }

    public boolean isSelected() {
        return this.selected;
    }

    public void setSelected(boolean selected) {
        this.selected = selected;
    }
}
