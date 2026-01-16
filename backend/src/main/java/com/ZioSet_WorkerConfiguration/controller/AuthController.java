package com.ZioSet_WorkerConfiguration.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ZioSet_WorkerConfiguration.dto.LoginRequest;
import com.ZioSet_WorkerConfiguration.model.UserInfo;
import com.ZioSet_WorkerConfiguration.service.UserDetailsImpl;
import com.ZioSet_WorkerConfiguration.utils.JwtUtils;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
  @Autowired
  AuthenticationManager authenticationManager;

  @Autowired
  JwtUtils jwtUtils;

  @Value("${app.auth.mode}")
  private String authMode;

  @PostMapping("/signin")
  public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
    Authentication authentication = authenticationManager
            .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

    SecurityContextHolder.getContext().setAuthentication(authentication);
    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

    if ("cookie".equalsIgnoreCase(authMode)) {
      ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(userDetails);
      Map<String,Object> body = Map.of(
              "user", userDetails
      );
      return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
              .body(body);
    } else {
      String jwt = jwtUtils.generateTokenFromUsername(userDetails.getUsername());
      Map<String,Object> body = Map.of(
              "token", jwt,
              "user", userDetails
      );
      return ResponseEntity.ok(body);
    }
  }

  @PostMapping("/signout")
  public ResponseEntity<?> logoutUser() {
    if ("cookie".equalsIgnoreCase(authMode)) {
      ResponseCookie cookie = jwtUtils.getCleanJwtCookie();
      return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString())
              .body(Map.of("message", "You've been signed out!"));
    } else {
      return ResponseEntity.ok(Map.of("message", "signed out"));
    }
  }

}
