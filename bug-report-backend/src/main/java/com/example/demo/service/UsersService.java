package com.example.demo.service;

import com.example.demo.entities.Users;
import com.example.demo.repository.UsersRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;


/**
 * In clasa UsersService a fost implementata logica pentru adaugarea, preluarea, updatarea,
 * respectiv stergerea datelor din tabelul Users.
 * In aceasta clasa se apeleaza repository-ul pentru a lucra cu baza de date.
 */

@Service
public class UsersService {
    @Autowired
    private UsersRepository usersRepository;

//    @Autowired
//    private PasswordEncoder passwordEncoder;

    public Users addUser(Users user) {
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required");
        }
        if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username is required");
        }
        if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password is required");
        }
        try {
            String HashedPassword = BCrypt.hashpw(user.getPassword(), BCrypt.gensalt());
            user.setPassword(HashedPassword);
            return this.usersRepository.save(user);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.IM_USED, e.getMessage());
        }
    }


    public Users getUserById(Long id) {
        Optional <Users> user = this.usersRepository.findById(id);
        if(!user.isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        else
            return user.get();
    }

    public List<Users> getAllUsers() {
        List<Users> users = (List<Users>) this.usersRepository.findAll();
        if(users.isEmpty()) {
            throw new  ResponseStatusException(HttpStatus.NOT_FOUND, "Users not found");
        }
        return users;
    }

    @Transactional
    public Users updateUser(Long id, Users user) {
        Users newUser = this.usersRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        newUser.setUsername(user.getUsername());
        newUser.setEmail(user.getEmail());
        String HashedPassword = BCrypt.hashpw(user.getPassword(), BCrypt.gensalt());
        newUser.setPassword(HashedPassword);
        newUser.setPhone(user.getPhone());
        newUser.setScore(user.getScore());
        newUser.setModerator(user.isModerator());
        newUser.setBanned(user.isBanned());

        return this.usersRepository.save(newUser);}

    public Boolean checkPassword(String username, String password) {
        UsersRepository usersRepository = this.usersRepository;
        Users user = usersRepository.findByUsername(username).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        return BCrypt.checkpw(password, user.getPassword());
    }


    public String deleteUserById(Long id) {
        if(this.usersRepository.existsById(id)) {
            this.usersRepository.deleteById(id);
            return "User deleted successfully";
        }
        else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
    }

    public Users findByEmail(String email) {
        return this.usersRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }
}
