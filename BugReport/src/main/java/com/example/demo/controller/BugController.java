package com.example.demo.controller;

import com.example.demo.entities.Bug;
import com.example.demo.repository.BugRepository;
import com.example.demo.service.BugService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/bug")
public class BugController {
    @Autowired
    private BugService bugService;

    @PostMapping("/addBug")
    public Bug addBug(@RequestBody Bug bug) {
        try{
           return bugService.addBug(bug);
        }
        catch(Exception e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Could not add bug");
        }
    }

    @PutMapping("/updateBug/{id}")
    public Bug updateBug(@PathVariable Integer id, @RequestBody Bug bug) {

        Bug b = bugService.getBugById(id);
        if(b ==null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Bug not found");
        }

        b.setAuthor(bug.getAuthor());
        b.setTitle(bug.getTitle());
        b.setDescription(bug.getDescription());
        b.setCreationDate(bug.getCreationDate());//de ce am avea nevoie?
        b.setImageURL(bug.getImageURL());
        b.setStatus(bug.getStatus());
        b.setVoteCount(bug.getVoteCount());

        return this.bugService.updateBug(bug);
    }

    @GetMapping("/getBug/{id}")
    public Bug getBugById(@PathVariable Integer id) {
        Bug b = bugService.getBugById(id);
        if(b ==null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Bug not found");
        }
        return b;
    }

    @GetMapping("/getAllBugs")
    public List<Bug> getAllBugs() {
        List<Bug> b = bugService.getAllBugs();
        if(b.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No Bugs found");
        }
        return this.bugService.getAllBugs();
    }

    @DeleteMapping("/deleteBug/{id}")
    public String deleteBug(@PathVariable Integer id) {
            if(this.bugService.getBugById(id) != null) {
                this.bugService.deleteBugById(id);
                return "Bug deleted successfully";
            }
            else
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Bug not found");
    }
}
