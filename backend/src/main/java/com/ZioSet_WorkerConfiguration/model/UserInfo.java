package com.ZioSet_WorkerConfiguration.model;


import java.util.Date;
import java.util.List;

import com.ZioSet_WorkerConfiguration.rolepermission.model.Role;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "user_mst",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "username"),
                @UniqueConstraint(columnNames = "email")
        })
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

  @ManyToOne
  @JoinColumn(name = "role_id")
  private Role role;

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public int getUserId() {
	return userId;
}

public void setUserId(int userId) {
	this.userId = userId;
}

public String getUsername() {
	return username;
}

public void setUsername(String username) {
	this.username = username;
}

public String getPassword() {
	return password;
}

public void setPassword(String password) {
	this.password = password;
}

public String getFirstName() {
	return firstName;
}

public void setFirstName(String firstName) {
	this.firstName = firstName;
}

public String getLastName() {
	return lastName;
}

public void setLastName(String lastName) {
	this.lastName = lastName;
}

public String getEmail() {
	return email;
}

public void setEmail(String email) {
	this.email = email;
}

public int getActive() {
	return active;
}

public void setActive(int active) {
	this.active = active;
}

public Date getUpdDatetime() {
	return updDatetime;
}

public void setUpdDatetime(Date updDatetime) {
	this.updDatetime = updDatetime;
}
  

 
  
}
