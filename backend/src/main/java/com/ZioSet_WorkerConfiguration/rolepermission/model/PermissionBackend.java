
package com.ZioSet_WorkerConfiguration.rolepermission.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@Table(name = "permissions_backend")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PermissionBackend {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name; //READ_USERS, WRITE_USERS, DELETE_USERS

    private String description;
}
