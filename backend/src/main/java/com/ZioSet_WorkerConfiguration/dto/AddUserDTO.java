package com.ZioSet_WorkerConfiguration.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AddUserDTO {
    private String username;
    private String password;
    private String firstName;
    private String lastName;
    private String email;
    private List<Integer> roleIds;
    private int active;
}
