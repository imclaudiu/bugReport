package com.example.demo.service;

import com.example.demo.entities.Users;
import com.example.demo.repository.UsersRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.http.ResponseEntity;


import java.util.List;
import java.util.Optional;

@Service
public class UsersService {
    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Users addUser(Users user) {
//        if(usersRepository.existsById(user.getId()))
//        {
//            throw new RuntimeException("User already exists");
//        }
        String HashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(HashedPassword);

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

    public List<Users> getAllUsers() {
        List<Users> users = (List<Users>) this.usersRepository.findAll();
        return users;
    }

    @Transactional
    public Users updateUser(Users user) {
        return this.usersRepository.save(user);}


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
