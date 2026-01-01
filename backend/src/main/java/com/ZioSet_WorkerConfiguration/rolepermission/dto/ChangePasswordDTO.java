package com.ZioSet_WorkerConfiguration.rolepermission.dto;

import lombok.Data;

@Data
public class ChangePasswordDTO {
    private int userId;
    private String currentPassword;
    private String newPassword;
}
