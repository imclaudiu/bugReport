package com.example.demo.repository;

import com.example.demo.entities.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * REPOSITORY CLASS pentru Comment.
 * JpaRepository contine si CrudRepository, deci nu este nevoie de CrudRepository inclus.
 * Comment vine de la clasa de enitate Comment, iar Primary Key-ul (@Id) determina Longul.
 */

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    @Query("SELECT c FROM Comment c LEFT JOIN FETCH c.replies WHERE c.bug.id = :bugId AND c.parent IS NULL")
    List<Comment> findByBugId(@Param("bugId") Long bugId);

    @Query("SELECT c FROM Comment c LEFT JOIN FETCH c.parent WHERE c.bug.id = :bugId AND c.parent IS NOT NULL")
    List<Comment> findRepliesByBugId(@Param("bugId") Long bugId);
}