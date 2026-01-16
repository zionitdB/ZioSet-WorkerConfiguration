package com.ZioSet_WorkerConfiguration.utils;

import java.util.Date;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;
import org.springframework.web.util.WebUtils;

import com.ZioSet_WorkerConfiguration.service.UserDetailsImpl;

import io.jsonwebtoken.*;
import java.security.Key;
import java.util.Base64;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtils {
  private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

  @Value("${app.jwt.secret}")
  private String jwtSecret;

  @Value("${app.jwt.expiration-ms}")
  private long jwtExpirationMs;

  @Value("${app.jwt.cookie-name}")
  private String jwtCookie;

  public String getJwtFromCookies(HttpServletRequest request) {
    Cookie cookie = WebUtils.getCookie(request, jwtCookie);
    if (cookie != null) {
      return cookie.getValue();
    } else {
      return null;
    }
  }

  public ResponseCookie generateJwtCookie(UserDetailsImpl userPrincipal) {
    String jwt = generateTokenFromUsername(userPrincipal.getUsername());

    return ResponseCookie.from(jwtCookie, jwt)
            .path("/")
            .httpOnly(true)
            .secure(true)              // REQUIRED for SameSite=None
            .sameSite("Lax")          // REQUIRED for cross-site
            .maxAge(jwtExpirationMs / 1000)
            .build();
  }


  public ResponseCookie getCleanJwtCookie() {
    return ResponseCookie.from(jwtCookie, "")
            .path("/")
            .httpOnly(true)
            .secure(true)
            .sameSite("Lax")
            .maxAge(0)
            .build();
  }

  public String getUserNameFromJwtToken(String token) {
    return Jwts.parserBuilder()
            .setSigningKey(getSigningKey())
            .build()
            .parseClaimsJws(token)
            .getBody()
            .getSubject();
  }

  public boolean validateJwtToken(String authToken) {
    try {
      Jwts.parserBuilder()
              .setSigningKey(getSigningKey())
              .build()
              .parseClaimsJws(authToken);
      return true;
    } catch (SignatureException e) {
      logger.error("Invalid JWT signature: {}", e.getMessage());
    } catch (MalformedJwtException e) {
      logger.error("Invalid JWT token: {}", e.getMessage());
    } catch (ExpiredJwtException e) {
      logger.error("JWT token is expired: {}", e.getMessage());
    } catch (UnsupportedJwtException e) {
      logger.error("JWT token is unsupported: {}", e.getMessage());
    } catch (IllegalArgumentException e) {
      logger.error("JWT claims string is empty: {}", e.getMessage());
    }

    return false;
  }

  public String generateTokenFromUsername(String username) {
    return Jwts.builder()
            .setSubject(username)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
            .signWith(getSigningKey(), SignatureAlgorithm.HS512)
            .compact();
  }


  private Key getSigningKey() {
    return Keys.hmacShaKeyFor(Base64.getDecoder().decode(jwtSecret));
  }

}
