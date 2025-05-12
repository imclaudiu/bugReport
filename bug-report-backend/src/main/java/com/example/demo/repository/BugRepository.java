package com.example.demo.repository;

import com.example.demo.entities.Bug;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * REPOSITORY CLASS pentru Buguri.
 * JpaRepository contine si CrudRepository, deci nu este nevoie de CrudRepository inclus.
 * Bug vine de la clasa de enitate Bug, iar Primary Key-ul (@Id) determina Longul.
 */

@Repository
public interface BugRepository extends JpaRepository<Bug, Long> {

}
