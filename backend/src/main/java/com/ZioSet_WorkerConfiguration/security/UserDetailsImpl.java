package com.ZioSet_WorkerConfiguration.security;

import java.util.*;

import com.ZioSet_WorkerConfiguration.rolepermission.model.Role;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.ZioSet_WorkerConfiguration.model.UserInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;

public class UserDetailsImpl implements UserDetails {
	private static final long serialVersionUID = 1L;

	private int id;

	private String username;

	private String email;

	private Set<Role> roles;

	private String firstName;

	private String lastName;

	private int active;

	@JsonIgnore
	private String password;

	private Collection<? extends GrantedAuthority> authorities;

	public UserDetailsImpl(int id, String username, String email, String password, String firstName, String lastName, int active, Set<Role> roles,
			Collection<? extends GrantedAuthority> authorities) {
		this.id = id;
		this.username = username;
		this.email = email;
		this.password = password;
		this.firstName = firstName;
		this.lastName = lastName;
		this.active = active;
		this.roles = roles;
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
				user.getRoles(),
				getAuthorities(user)
		);
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return authorities;
	}


	private static Collection<? extends GrantedAuthority> getAuthorities(UserInfo user) {
		Set<GrantedAuthority> authorities = new HashSet<>();

		user.getRoles().forEach(role -> {
			authorities.add(new SimpleGrantedAuthority("ROLE_"+role.getRoleName()));

			role.getPermissions().forEach(permission ->
					authorities.add(new SimpleGrantedAuthority(permission.getName()))
			);
		});

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

    public Set<Role> getRole() {
        return roles;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

}
