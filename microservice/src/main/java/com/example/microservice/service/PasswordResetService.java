package com.example.microservice.service;

import com.example.microservice.entity.Users;
import com.example.microservice.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PasswordResetService {
    @Autowired
    private UsersRepository usersRepository;

    public String createResetToken(String email){
        Users user = usersRepository.findByEmail(email).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        String token = UUID.randomUUID().toString();
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(15);

        user.setResetToken(token);
        user.setTokenExpiration(expiry);
        usersRepository.save(user);

        return token;
    }

    public void resetPassword(String token, String newPassword){
        Users user = usersRepository.findByResetToken(token).orElseThrow(()-> new RuntimeException("Invalid token."));

        if(user.getTokenExpiration() == null || user.getTokenExpiration().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token expired.");
        }

        String HashedPassword = BCrypt.hashpw(newPassword, BCrypt.gensalt());
        user.setPassword(HashedPassword);
        user.setResetToken(null);
        user.setTokenExpiration(null);
        usersRepository.save(user);
    }
}
