package com.ZioSet_WorkerConfiguration.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddUserDTO {
    private String username;
    private String password;
    private String firstName;
    private String lastName;
    private String email;
    private List<Integer> roleIds;
    private int active;
}
