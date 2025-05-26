package com.example.demo.service;

import com.example.demo.entities.Users;
import com.example.demo.entities.Vote;
import com.example.demo.repository.UsersRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCrypt;
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

    @Autowired
    private EmailService emailService;

    @Autowired
    private SmsService smsService;

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

    public Users getUserByUsername(String username) {
        return this.usersRepository.findByUsername(username)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
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

        // Only update fields that are provided
        if (user.getUsername() != null && !user.getUsername().trim().isEmpty()) {
            newUser.setUsername(user.getUsername());
        }
        if (user.getEmail() != null && !user.getEmail().trim().isEmpty()) {
            newUser.setEmail(user.getEmail());
        }
        if (user.getPassword() != null && !user.getPassword().trim().isEmpty()) {
            String HashedPassword = BCrypt.hashpw(user.getPassword(), BCrypt.gensalt());
            newUser.setPassword(HashedPassword);
        }
        if (user.getPhone() != null) {
            newUser.setPhone(user.getPhone());
        }
        if (user.getScore() != newUser.getScore()) {
            newUser.setScore(user.getScore());
        }
        if (user.isModerator() != newUser.isModerator()) {
            newUser.setModerator(user.isModerator());
        }
        if (user.isBanned() != newUser.isBanned()) {
            newUser.setBanned(user.isBanned());
        }

        return this.usersRepository.save(newUser);
    }

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
    public Users banUser(Long id) {
        Users user = this.usersRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        if(user.isModerator()){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Cannot ban a moderator");
        }else {
            user.setBanned(true);
        }
        Users savedUser = this.usersRepository.save(user);

//        if (user.getEmail() != null && !user.getEmail().trim().isEmpty()) {
//            emailService.sendEmail(user.getEmail(),
//                    "Salut!",
//                    "Contul tău a fost suspendat de către moderatori. Pentru mai multe informații, contactează echipa de suport.");
//        }

        if (user.getPhone() != null && !user.getPhone().trim().isEmpty()) {
            smsService.sendSms(
                    user.getPhone(),
                    "You have been banned from the platform."
            );
        }

        return savedUser;
    }
    public Users unbanUser(Long id) {
        Users user = this.usersRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        if(user.isModerator()){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Cannot unban a moderator");
        }else {
            user.setBanned(false);
        }
        return this.usersRepository.save(user);
    }
}
