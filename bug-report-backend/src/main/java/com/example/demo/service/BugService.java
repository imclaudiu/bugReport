package com.example.demo.service;

import com.example.demo.entities.Bug;
import com.example.demo.repository.BugRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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

    public Bug addBug(Bug bug) {
            try {
                return this.bugRepository.save(bug);
            }
            catch (Exception e) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error1!");
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
        b.setCreationDate(bug.getCreationDate());//de ce am avea nevoie?
        b.setImageURL(bug.getImageURL());
        b.setStatus(bug.getStatus());
        b.setVoteCount(bug.getVoteCount());

        return this.bugRepository.save(b);}


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
}
