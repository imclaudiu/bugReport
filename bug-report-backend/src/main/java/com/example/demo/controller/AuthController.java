package com.example.demo.controller;

import com.example.demo.entities.Users;
import com.example.demo.service.UsersService;
import com.example.demo.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UsersService usersService;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        
        try {
            Users user = usersService.findByEmail(email);
            if (user != null && usersService.checkPassword(user.getUsername(), password)) {
                // Generate JWT token
                String token = jwtUtils.generateToken(user);
                
                Map<String, Object> response = new HashMap<>();
                response.put("token", token);
                response.put("user", user);
                response.put("expiresIn", 3600); // 1 hour in seconds
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body("Invalid credentials");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
} 