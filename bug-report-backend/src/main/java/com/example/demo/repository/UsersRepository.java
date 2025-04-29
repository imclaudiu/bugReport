package com.example.demo.repository;

import com.example.demo.entities.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * REPOSITORY CLASS pentru User.
 * JpaRepository contine si CrudRepository, deci nu este nevoie de CrudRepository inclus.
 * User vine de la clasa de enitate User, iar Primary Key-ul (@Id) determina Longul.
 */

@Repository
public interface UsersRepository extends JpaRepository<Users, Long> {
//    boolean existsByEmail(String usernname);
    Optional<Users> findByUsername(String username);
    Optional<Users> findByEmail(String email);
}
