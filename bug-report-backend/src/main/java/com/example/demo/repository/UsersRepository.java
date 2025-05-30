package com.example.demo.repository;

import com.example.demo.entities.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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
    Optional<Users> findById(Long id);
    @Modifying
    @Query("UPDATE Users u SET u.score = COALESCE(u.score, 0) + :delta WHERE u.id = :userId")
    void updateUserScore(@Param("userId") Long userId, @Param("delta") float delta);
}
