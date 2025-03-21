package com.example.demo.controller;

import com.example.demo.entities.Users;
import com.example.demo.service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.ResponseEntity;


import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UsersController {

    @Autowired
    private UsersService usersService;
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public Users addUser(@RequestBody Users user) throws Exception {
        try {
            return this.usersService.addUser(user);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @GetMapping("/getUser/{id}")
    public Users getUserById(@PathVariable Long id) {
        Users u = usersService.getUserById(id);
        if(u == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        return u;
    }

    @GetMapping("/getEmail/{email}")
    public Users getUserByEmail(@PathVariable String email) {
        Optional<Users> usersOptional = usersService.findUserByEmail(email);
        return usersOptional.orElse(null);
    }

    @GetMapping("/getAllUsers")
    public List<Users> getAllUsers() {
        List <Users> user = usersService.getAllUsers();
        if(user.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "There are no users");
        }
        return this.usersService.getAllUsers();
    }

    @DeleteMapping("/deleteUser/{id}")
    public String deleteUserById(@PathVariable Long id) {
        Users u = usersService.getUserById(id);
        if(u == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        return this.usersService.deleteUserById(id);
    }

    @PutMapping("/updateUser/{id}")
    public Users updateUser(@PathVariable Long id, @RequestBody Users user) {
        Users u = usersService.getUserById(id);
        if(u == null)
        {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User not found");
        }

        u.setUsername(user.getUsername());
        u.setEmail(user.getEmail());
        u.setPassword(user.getPassword());
        u.setPhone(user.getPhone());
        u.setScore(user.getScore());
        u.setModerator(user.isModerator());
        u.setBanned(user.isBanned());

            return this.usersService.updateUser(u);
    }

}
