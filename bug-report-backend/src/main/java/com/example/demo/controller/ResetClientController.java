package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RestController
@RequestMapping("/api/reset")
public class ResetClientController {

    private final String MICRO_URL = "http://localhost:8081/resetPass";

    @Autowired
    private RestTemplate restTemplate;

    @PostMapping("/request")
    public ResponseEntity<?> requestReset(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");

        ResponseEntity<Map> response = restTemplate.postForEntity(
                MICRO_URL + "/generate-token",
                payload,
                Map.class
        );

        return ResponseEntity.ok(response.getBody());
    }

    @PostMapping("/confirm")
    public ResponseEntity<String> confirmReset(@RequestBody Map<String, String> payload) {
        restTemplate.postForEntity(
                MICRO_URL + "/reset-password",
                payload,
                String.class
        );
        return ResponseEntity.ok("Password reset successfully.");
    }
}
