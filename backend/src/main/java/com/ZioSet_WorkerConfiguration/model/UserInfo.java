package com.ZioSet_WorkerConfiguration.model;


import java.util.Date;
import java.util.List;

import com.ZioSet_WorkerConfiguration.rolepermission.model.Role;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

@Entity
@Table(name = "user_mst")
public class UserInfo {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "user_id")
  private int userId;
  
  @Column(name = "username")
  private String username;
  
  @Column(name = "password")
  private String password;
  
  @Column(name = "first_name")
  private String firstName;
  
  @Column(name = "last_name")
  private String lastName;
  
  @Column(name = "email")
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
