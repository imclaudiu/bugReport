package com.example.demo.repository;

import com.example.demo.entities.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * REPOSITORY CLASS pentru Comment.
 * JpaRepository contine si CrudRepository, deci nu este nevoie de CrudRepository inclus.
 * Comment vine de la clasa de enitate Comment, iar Primary Key-ul (@Id) determina Longul.
 */

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByBugId(Long bugId);
}