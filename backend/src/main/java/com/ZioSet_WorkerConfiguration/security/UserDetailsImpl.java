package com.ZioSet_WorkerConfiguration.security;

import java.util.Collection;
import java.util.Collections;
import java.util.Objects;
import java.util.Set;

import com.ZioSet_WorkerConfiguration.rolepermission.model.Role;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.ZioSet_WorkerConfiguration.model.UserInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;

public class UserDetailsImpl implements UserDetails {
	private static final long serialVersionUID = 1L;

	private int id;

	private String username;

	private String email;

	private Role role;

	private String firstName;

	private String lastName;

	private int active;

	@JsonIgnore
	private String password;

	private Collection<? extends GrantedAuthority> authorities;

	public UserDetailsImpl(int id, String username, String email, String password, String firstName, String lastName, int active, Role role,
			Collection<? extends GrantedAuthority> authorities) {
		this.id = id;
		this.username = username;
		this.email = email;
		this.password = password;
		this.firstName = firstName;
		this.lastName = lastName;
		this.active = active;
		this.role = role;
		this.authorities = authorities;
	}

	public static UserDetailsImpl build(UserInfo user) {
		
		return new UserDetailsImpl(
				user.getUserId(), 
				user.getUsername(), 
				user.getEmail(),
				user.getPassword(),
				user.getFirstName(),
				user.getLastName(),
				user.getActive(),
//				user.getRole(),
				new Role(),
				Collections.emptyList());
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return authorities;
	}

	public int getId() {
		return id;
	}

	public String getEmail() {
		return email;
	}

	@Override
	public String getPassword() {
		return password;
	}

	@Override
	public String getUsername() {
		return username;
	}

	@Override
	public boolean isAccountNonExpired() {
		return active == 1;
	}

	@Override
	public boolean isAccountNonLocked() {
		return active == 1;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return active == 1;
	}

	@Override
	public boolean isEnabled() {
		return active == 1;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o)
			return true;
		if (o == null || getClass() != o.getClass())
			return false;
		UserDetailsImpl user = (UserDetailsImpl) o;
		return Objects.equals(id, user.id);
	}

    public Role getRole() {
        return role;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

}
