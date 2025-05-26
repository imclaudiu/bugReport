package com.example.demo.repository;

import com.example.demo.entities.Bug;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * REPOSITORY CLASS pentru Buguri.
 * JpaRepository contine si CrudRepository, deci nu este nevoie de CrudRepository inclus.
 * Bug vine de la clasa de enitate Bug, iar Primary Key-ul (@Id) determina Longul.
 */

@Repository
public interface BugRepository extends JpaRepository<Bug, Long> {
    List<Bug> findAllByOrderByCreationDateDesc();
    
    // Search by title
    List<Bug> findByTitleContainingIgnoreCase(String title);
    
    // Get bugs by user
    List<Bug> findByAuthorId(Long userId);
    
    // Get bugs by user sorted by creation date
    List<Bug> findByAuthorIdOrderByCreationDateDesc(Long userId);
    
    // Get bugs by tag
    @Query("SELECT b FROM Bug b JOIN b.tags t WHERE t.name = :tagName")
    List<Bug> findByTagName(@Param("tagName") String tagName);
    
    // Get bugs by multiple criteria
    @Query("SELECT DISTINCT b FROM Bug b " +
           "LEFT JOIN b.tags t " +
           "WHERE (:title IS NULL OR LOWER(CAST(b.title AS string)) LIKE LOWER(CONCAT('%', :title, '%'))) " +
           "AND (:userId IS NULL OR b.author.id = :userId) " +
           "AND (:tagName IS NULL OR EXISTS (SELECT 1 FROM b.tags t2 WHERE t2.name = :tagName))")
    List<Bug> findByMultipleCriteria(
        @Param("title") String title,
        @Param("userId") Long userId,
        @Param("tagName") String tagName
    );
}
