package com.example.demo.repository;

import com.example.demo.entities.Users;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsersRepository extends CrudRepository<Users, Long> {
    boolean existsByEmail(String email);
    Optional<Users> findByEmail(String email);
}
