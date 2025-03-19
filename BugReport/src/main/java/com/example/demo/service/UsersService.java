package com.example.demo.service;

import com.example.demo.entities.Users;
import com.example.demo.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UsersService {
    @Autowired
    private UsersRepository usersRepository;

    public Users addUser(Users user) {
        return this.usersRepository.save(user);
    }

    public Optional<Users> findUserByEmail(String email) {
        return this.usersRepository.findByEmail(email);
    }

    public boolean existsUserByEmail(String email) {
        return this.usersRepository.existsByEmail(email);
    }

    public Users getUserById(Long id) {
        Optional <Users> user = this.usersRepository.findById(id);
        return user.orElse(null);
    }

    public String deleteUserById(Long id) {
        try{
            this.usersRepository.deleteById(id);
            return "User has been deleted";
        }
        catch(Exception e){
            return "Failed to delete user: " + id;
        }
    }
}
