package com.example.demo.controller;

import com.example.demo.entities.Users;
import com.example.demo.service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Clasa de control al Userilor. In aceasta clasa se apeleaza serviciile entitatilor.
 * Aceasta clasa trebuie tinuta permanent CURATA! Nu exista logica aici, doar se apeleaza serviciile.
 */

@RestController
@RequestMapping("/users")
public class UsersController {

    @Autowired
    private UsersService usersService;

    @PostMapping("/register")
    public Users addUser(@RequestBody Users user){
        return this.usersService.addUser(user);
    }

    @GetMapping("/getUser/{id}")
    public Users getUserById(@PathVariable Long id) {
        return this.usersService.getUserById(id);
    }

    @GetMapping("/getAllUsers")
    public List<Users> getAllUsers() {
        return this.usersService.getAllUsers();
    }

    @DeleteMapping("/deleteUser/{id}")
    public String deleteUserById(@PathVariable Long id) {
        return this.usersService.deleteUserById(id);
    }

    @PutMapping("/updateUser/{id}")
    public Users updateUser(@PathVariable Long id, @RequestBody Users user) {

            return this.usersService.updateUser(id, user);
    }

    @GetMapping("/checkPass/{username}/{password}")
    public boolean checkPass(@PathVariable String username, @PathVariable String password) {

        return this.usersService.checkPassword(username, password);
    }
}
