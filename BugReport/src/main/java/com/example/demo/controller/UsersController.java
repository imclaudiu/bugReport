package com.example.demo.controller;

import com.example.demo.entities.Users;
import com.example.demo.service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/users")
public class UsersController {

    @Autowired
    private UsersService usersService;

    @PostMapping("/register")
    public Users addUser(@RequestBody Users user) throws Exception {
        try {
            Users u = usersService.addUser(user);
            return u;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @GetMapping("/getUser/{id}")
    public Users getUserById(@PathVariable Long id) {
        return this.usersService.getUserById(id);
    }

    @DeleteMapping("/deleteUser/{id}")
    public String deleteUserById(@PathVariable Long id) {
        return this.usersService.deleteUserById(id);
    }

}
