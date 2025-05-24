package com.example.demo.controller;

import com.example.demo.entities.Bug;
import com.example.demo.service.BugService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Clasa de control pentru Buguri. In aceasta clasa se apeleaza serviciile entitatilor.
 * Aceasta clasa trebuie tinuta permanent CURATA! Nu exista logica aici, se apeleaza doar serviciile.
 */

@RestController
@RequestMapping("/bug")
public class BugController {
    @Autowired
    private BugService bugService;

    @PostMapping("/addBug")
    public Bug addBug(@RequestBody Bug bug) {
           return bugService.addBug(bug);
    }

    @GetMapping("/getBug/{id}")
    public Bug getBugById(@PathVariable Long id) {
        return this.bugService.getBugById(id);
    }

    @GetMapping("/getAllBugs")
    public List<Bug> getAllBugs() {
        return this.bugService.getAllBugs();
    }

    @PutMapping("/updateBug/{id}")
    public Bug updateBug(@PathVariable Long id, @RequestBody Bug bug) {
        return this.bugService.updateBug(id, bug);
    }

    @DeleteMapping("/deleteBug/{id}")
    public String deleteBug(@PathVariable Long id) {
        return this.bugService.deleteBugById(id);
    }

    @GetMapping("/sortByDate")
    public List<Bug> sortByDate() {
        return this.bugService.getAllBugsSortedByDate();
    }

    @GetMapping("/search")
    public List<Bug> searchBugs(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String tagName) {
        return this.bugService.filterBugs(title, userId, tagName);
    }

    @GetMapping("/search/title")
    public List<Bug> searchByTitle(@RequestParam String title) {
        return this.bugService.searchBugsByTitle(title);
    }

    @GetMapping("/search/user/{userId}")
    public List<Bug> searchByUser(@PathVariable Long userId) {
        return this.bugService.getBugsByUser(userId);
    }

    @GetMapping("/search/tag/{tagName}")
    public List<Bug> searchByTag(@PathVariable String tagName) {
        return this.bugService.getBugsByTag(tagName);
    }
}

