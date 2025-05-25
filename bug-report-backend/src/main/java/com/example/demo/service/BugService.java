package com.example.demo.service;

import com.example.demo.entities.Bug;
import com.example.demo.entities.Tag;
import com.example.demo.entities.Users;
import com.example.demo.repository.BugRepository;
import com.example.demo.repository.TagRepository;
import com.example.demo.repository.UsersRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * In clasa BugService a fost implementata logica pentru adaugarea, preluarea, updatarea,
 * respectiv stergerea datelor din tabelul Bug.
 * In aceasta clasa se apeleaza repository-ul pentru a lucra cu baza de date.
 */

@Service
public class BugService {
    @Autowired
    private BugRepository bugRepository;

    @Autowired
    private TagRepository tagRepository;
    @Autowired
    private UsersRepository userRepository;

    @Transactional
    public Bug addBug(Bug bug) {
        try {
            if (bug.getCreationDate() == null) {
                bug.setCreationDate(ZonedDateTime.now());
            }

            // Handle tags
            if (bug.getTags() != null) {
                List<Tag> managedTags = new ArrayList<>();
                for (Tag tag : bug.getTags()) {
                    // Check if tag exists
                    Optional<Tag> existingTag = tagRepository.findByName(tag.getName());
                    if (existingTag.isPresent()) {
                        managedTags.add(existingTag.get());
                    } else {
                        // Create new tag if it doesn't exist
                        Tag newTag = new Tag();
                        newTag.setName(tag.getName());
                        managedTags.add(tagRepository.save(newTag));
                    }
                }
                bug.setTags(managedTags);
            }

            return this.bugRepository.save(bug);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error adding bug: " + e.getMessage());
        }
    }

    public Bug getBugById(Long id) {
        Optional <Bug> bug = this.bugRepository.findById(id);
        if(bug.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Bug Not Found!");
        }
        return bug.orElse(null);
    }

    public List<Bug> getAllBugs(){
        List<Bug> bugs = this.bugRepository.findAll();
        if(bugs.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No bugs found!");
        }
        return bugs;
    }


    @Transactional
    public Bug updateBug(Long id, Bug bug) {
        Bug b = this.bugRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Bug Not Found!"));

        b.setAuthor(bug.getAuthor());
        b.setTitle(bug.getTitle());
        b.setDescription(bug.getDescription());
        b.setCreationDate(bug.getCreationDate());
        b.setImageURL(bug.getImageURL());
        b.setStatus(bug.getStatus());
        b.setVoteCount(bug.getVoteCount());

        // Handle tags
        if (bug.getTags() != null) {
            List<Tag> managedTags = new ArrayList<>();
            for (Tag tag : bug.getTags()) {
                // Check if tag exists
                Optional<Tag> existingTag = tagRepository.findByName(tag.getName());
                if (existingTag.isPresent()) {
                    managedTags.add(existingTag.get());
                } else {
                    // Create new tag if it doesn't exist
                    Tag newTag = new Tag();
                    newTag.setName(tag.getName());
                    managedTags.add(tagRepository.save(newTag));
                }
            }
            b.setTags(managedTags);
        }

        return this.bugRepository.save(b);
    }


    @Transactional
    public String deleteBugById(Long id) {
        if(this.bugRepository.existsById(id)) {
            this.bugRepository.deleteById(id);
            return "Bug deleted successfully!";
        }
        else
        {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Bug Not Found!");
        }
    }
    public List<Bug> getAllBugsSortedByDate() {
        return bugRepository.findAllByOrderByCreationDateDesc();
    }

    // Search bugs by title
    public List<Bug> searchBugsByTitle(String title) {
        if (title == null || title.trim().isEmpty()) {
            return getAllBugs();
        }
        return bugRepository.findByTitleContainingIgnoreCase(title);
    }

    // Get bugs by user
    public List<Bug> getBugsByUser(Long userId) {
        List<Bug> bugs = bugRepository.findByAuthorIdOrderByCreationDateDesc(userId);
        return bugs;
    }

    // Get bugs by tag
    public List<Bug> getBugsByTag(String tagName) {
        if (tagName == null || tagName.trim().isEmpty()) {
            return getAllBugs();
        }
        return bugRepository.findByTagName(tagName);
    }

    // Get bugs by multiple criteria
    public List<Bug> filterBugs(String title, Long userId, String tagName) {
        return bugRepository.findByMultipleCriteria(title, userId, tagName);
    }
    public Bug upvoteBug(Long bugId) {
        Bug bug = bugRepository.findById(bugId).orElseThrow();
        Users author = bug.getAuthor();
        bug.setVoteCount(bug.getVoteCount() + 1);
        author.setScore((float)(author.getScore() + 2.5));
        userRepository.save(author);
        return bugRepository.save(bug);
    }

    public Bug downvoteBug(Long bugId) {
        Bug bug = bugRepository.findById(bugId).orElseThrow();
        Users author = bug.getAuthor();
        bug.setVoteCount(bug.getVoteCount() - 1);
        author.setScore((float)(author.getScore() - 1.5));
        userRepository.save(author);
        return bugRepository.save(bug);

    }
}
