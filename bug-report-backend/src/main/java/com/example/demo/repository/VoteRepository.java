package com.example.demo.repository;

import com.example.demo.entities.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VoteRepository extends JpaRepository<Vote, Long> {
    List<Vote> findByTargetId(int targetId);
    List<Vote> findByUserId(Long userId);
    Optional<Vote> findByUserIdAndTargetIdAndTargetType(Long userId, int targetId, String targetType);

}
