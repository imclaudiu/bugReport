package com.example.demo.service;

import com.example.demo.entities.Users;
import com.example.demo.entities.Vote;
import com.example.demo.repository.UsersRepository;
import com.example.demo.repository.VoteRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

/**
 * In clasa VoteService se implementează logica pentru adăugarea, obținerea, actualizarea și ștergerea voturilor.
 */
@Service
public class VoteService {

    @Autowired
    private VoteRepository voteRepository;

    @Autowired
    private UsersRepository usersRepository;

    @Transactional
    public Vote addVote(Vote vote) {
        Users user = usersRepository.findById(vote.getUser().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        vote.setUser(user);

        if (!vote.getVoteType().equals("UPVOTE") && !vote.getVoteType().equals("DOWNVOTE")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "voteType must be UPVOTE or DOWNVOTE");
        }

        if (!vote.getTargetType().equals("BUG") && !vote.getTargetType().equals("COMMENT")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "targetType must be BUG or COMMENT");
        }

        // Evităm vot dublu
        Optional<Vote> existingVote = voteRepository.findByUserIdAndTargetIdAndTargetType(
                user.getId(), vote.getTargetId(), vote.getTargetType()
        );

        if (existingVote.isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User already voted on this target");
        }

        return voteRepository.save(vote);
    }


    public Vote getVoteById(Long id) {
        return voteRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vote not found with ID: " + id));
    }

    public List<Vote> getAllVotes() {
        List<Vote> votes = voteRepository.findAll();
        if (votes.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No votes found!");
        }
        return votes;
    }

    public Vote updateVote(Long id, Vote updatedVote) {
        Vote vote = voteRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vote not found with ID: " + id));

        Users user = usersRepository.findById(updatedVote.getUser().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found for ID: " + updatedVote.getUser().getId()));
        vote.setUser(user);

        vote.setTargetId(updatedVote.getTargetId());

        if (!updatedVote.getVoteType().equals("UPVOTE") && !updatedVote.getVoteType().equals("DOWNVOTE")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "voteType must be UPVOTE or DOWNVOTE");
        }

        vote.setVoteType(updatedVote.getVoteType());

        return voteRepository.save(vote);
    }

    public String deleteVote(Long id) {
        Vote vote = voteRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vote not found with ID: " + id));
        voteRepository.delete(vote);
        return "Vote with ID: " + id + " has been deleted!";
    }

    public List<Vote> getVotesByTargetId(int targetId) {
        return voteRepository.findByTargetId(targetId);
    }

    public List<Vote> getVotesByUserId(Long userId) {
        return voteRepository.findByUserId(userId);
    }



}
