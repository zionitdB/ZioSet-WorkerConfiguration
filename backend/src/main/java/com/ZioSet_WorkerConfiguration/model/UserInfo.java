package com.ZioSet_WorkerConfiguration.model;


import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.ZioSet_WorkerConfiguration.rolepermission.model.Role;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "user_mst",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "username"),
                @UniqueConstraint(columnNames = "email")
        })
@Data
public class UserInfo {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "user_id")
  private int userId;

  @Column(name = "username", nullable = false, unique = true, length = 100)
  private String username;

  @JsonIgnore
  @Column(name = "password", nullable = false)
  private String password;
  
  @Column(name = "first_name")
  private String firstName;
  
  @Column(name = "last_name")
  private String lastName;

  @Column(name = "email", nullable = false, unique = true, length = 150)
  private String email;

  @Column(name = "active")
  private int active;
  
  @Column(name = "upd_datetime")
  private Date updDatetime;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();



  
}
