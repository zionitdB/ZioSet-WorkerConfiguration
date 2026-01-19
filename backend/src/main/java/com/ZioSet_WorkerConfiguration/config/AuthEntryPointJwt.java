package com.ZioSet_WorkerConfiguration.config;

import java.io.IOException;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.*;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

@Component
public class AuthEntryPointJwt implements AuthenticationEntryPoint {

  private static final Logger logger = LoggerFactory.getLogger(AuthEntryPointJwt.class);

  @Override
  public void commence(
          HttpServletRequest request,
          HttpServletResponse response,
          AuthenticationException ex)
          throws IOException {
    logger.error("Unauthorized error: {}", ex.getMessage());
    response.setContentType("application/json");
    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

    String message = getString(ex);

    response.getWriter().write(String.format("""
            {
              "status": 401,
              "error": "Unauthorized",
              "message": "%s",
              "path": "%s"
            }
        """, message, request.getRequestURI()));
  }

  private static String getString(AuthenticationException ex) {
    String message = "Authentication failed";

    if (ex instanceof BadCredentialsException) {
      message = "Invalid username or password";
    } else if (ex instanceof DisabledException) {
      message = "User account is disabled";
    } else if (ex instanceof LockedException) {
      message = "User account is locked";
    } else if (ex instanceof AccountExpiredException) {
      message = "User account has expired";
    } else if (ex instanceof CredentialsExpiredException) {
      message = "User credentials have expired";
    } else if (ex instanceof AuthenticationServiceException) {
      message = "Authentication service error";
    }
    return message;
  }

}
