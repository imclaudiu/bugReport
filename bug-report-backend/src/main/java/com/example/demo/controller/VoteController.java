package com.example.demo.controller;

import com.example.demo.entities.Vote;
import com.example.demo.service.VoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller pentru gestionarea voturilor. Apelează direct metodele din VoteService.
 */
@RestController
@RequestMapping("/vote")
public class VoteController {

    @Autowired
    private VoteService voteService;

    @PostMapping("/addVote")
    public Vote addVote(@RequestBody Vote vote) {
        return voteService.addVote(vote);
    }

    @GetMapping("/getVote/{id}")
    public Vote getVoteById(@PathVariable Long id) {
        return voteService.getVoteById(id);
    }

    @GetMapping("/getAllVotes")
    public List<Vote> getAllVotes() {
        return voteService.getAllVotes();
    }

    @PutMapping("/updateVote/{id}")
    public Vote updateVote(@PathVariable Long id, @RequestBody Vote vote) {
        return voteService.updateVote(id, vote);
    }

    @DeleteMapping("/deleteVote/{id}")
    public String deleteVote(@PathVariable Long id) {
        return voteService.deleteVote(id);
    }

    @GetMapping("/byTarget/{targetId}")
    public List<Vote> getVotesByTargetId(@PathVariable int targetId) {
        return voteService.getVotesByTargetId(targetId);
    }

    @GetMapping("/byUser/{userId}")
    public List<Vote> getVotesByUserId(@PathVariable Long userId) {
        return voteService.getVotesByUserId(userId);
    }
}
