package com.ZioSet_WorkerConfiguration;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Collections;

import com.ZioSet_WorkerConfiguration.rolepermission.model.Role;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseCookie;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.test.util.ReflectionTestUtils;

import com.ZioSet_WorkerConfiguration.service.UserDetailsImpl;
import com.ZioSet_WorkerConfiguration.utils.JwtUtils;

public class JwtUtilsTest {

    private JwtUtils jwtUtils;

    @BeforeEach
    public void setUp() {
        jwtUtils = new JwtUtils();
        ReflectionTestUtils.setField(jwtUtils, "jwtSecret", "testSecretKeytestSecretKeytestSecretKeytestSecretKeytestSecretKeytestSecretKeytestSecretKeytestSecretKey");
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", 3600000);
        ReflectionTestUtils.setField(jwtUtils, "jwtCookie", "zioset-jwt");
    }

    @Test
    public void testGenerateJwtCookie() {
        UserDetailsImpl userDetails = new UserDetailsImpl(1, "testuser", "test@example.com", "password",  "firstName", "lastName", 1, new Role(), Collections.emptyList());
        ResponseCookie cookie = jwtUtils.generateJwtCookie(userDetails);
        assertNotNull(cookie);
        assertEquals("zioset-jwt", cookie.getName());
        assertNotNull(cookie.getValue());
        assertTrue(cookie.isHttpOnly());
    }

    @Test
    public void testValidateJwtToken() {
        String token = jwtUtils.generateTokenFromUsername("testuser");
        assertTrue(jwtUtils.validateJwtToken(token));
    }

    @Test
    public void testGetUserNameFromJwtToken() {
        String token = jwtUtils.generateTokenFromUsername("testuser");
        assertEquals("testuser", jwtUtils.getUserNameFromJwtToken(token));
    }
    
    @Test
    public void testGetJwtFromCookies() {
        String token = jwtUtils.generateTokenFromUsername("testuser");
        MockHttpServletRequest request = new MockHttpServletRequest();
        jakarta.servlet.http.Cookie cookie = new jakarta.servlet.http.Cookie("zioset-jwt", token);
        request.setCookies(cookie);
        
        String jwt = jwtUtils.getJwtFromCookies(request);
        assertEquals(token, jwt);
    }
}
