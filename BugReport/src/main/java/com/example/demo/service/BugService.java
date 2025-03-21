package com.example.demo.service;

import com.example.demo.entities.Bug;
import com.example.demo.repository.BugRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BugService {
    @Autowired
    private BugRepository bugRepository;

    public Bug addBug(Bug bug) {
        if(bugRepository.existsById(bug.getId()))
        {
            throw new RuntimeException("This bug id is already in use");
        }
        return this.bugRepository.save(bug);
    }

    public Bug getBugById(Integer id) {
        Optional <Bug> bug = this.bugRepository.findById(id);
        return bug.orElse(null);
    }

    public List<Bug> getAllBugs(){
        List<Bug> bugs = (List<Bug>) this.bugRepository.findAll();
        return bugs;
    }

    @Transactional
    public Bug updateBug(Bug bug) {
        return this.bugRepository.save(bug);}


    public void deleteBugById(Integer id) {
        try{
            this.bugRepository.deleteById(id);
//            return "Bug has been deleted";
        }
        catch(Exception e){
            throw new RuntimeException("Could not delete bug with id "+id);
//            return "Failed to delete bug: " + id;
        }
    }
}
