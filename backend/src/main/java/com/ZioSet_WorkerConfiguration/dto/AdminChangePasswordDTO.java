package com.ZioSet_WorkerConfiguration.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminChangePasswordDTO {
    private int userId;
    private String newPassword;
}
