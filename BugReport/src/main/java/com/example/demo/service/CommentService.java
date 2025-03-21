package com.example.demo.service;

import com.example.demo.entities.Bug;
import com.example.demo.entities.Comment;
import com.example.demo.entities.Users;
import com.example.demo.repository.BugRepository;
import com.example.demo.repository.CommentRepository;
import com.example.demo.repository.UsersRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private BugRepository bugRepository;

    @Autowired
    private UsersRepository usersRepository;

    @Transactional
    public Comment addComment(Comment comment) {
        // Fetch Bug entity
        Bug bug = bugRepository.findById(comment.getBug().getId()).orElse(null);
        if (bug == null) {
            throw new RuntimeException("Bug not found for ID: " + comment.getBug().getId());
        }
        comment.setBug(bug);

        // Fetch Users entity
        Users author = usersRepository.findById(comment.getAuthor().getId()).orElse(null);
        if (author == null) {
            throw new RuntimeException("User not found for ID: " + comment.getAuthor().getId());
        }
        comment.setAuthor(author);

        return commentRepository.save(comment);
    }


    public Comment findById(Long id) {
        Optional<Comment> comment = this.commentRepository.findById(id);
        return comment.orElse(null);
    }

    public List<Comment> findAll() {
        return commentRepository.findAll();
    }

    public Comment updateComment(Comment comment) {
        Optional<Comment> existingComment = commentRepository.findById(comment.getId());
        if (existingComment.isPresent()) {
            // Fetch the Bug and Users entities again to update the comment
            Bug bug = bugRepository.findById(comment.getBug().getId()).orElse(null);
            if (bug == null) {
                throw new RuntimeException("Bug not found for ID: " + comment.getBug().getId());
            }
            comment.setBug(bug);

            Users author = usersRepository.findById(comment.getAuthor().getId()).orElse(null);
            if (author == null) {
                throw new RuntimeException("User not found for ID: " + comment.getAuthor().getId());
            }
            comment.setAuthor(author);

            // Save the updated comment and return
            return commentRepository.save(comment);
        } else {
            throw new RuntimeException("Comment not found for ID: " + comment.getId());
        }
    }

    public void deleteComment(Long id) {
        Optional<Comment> comment = commentRepository.findById(id);
        if (comment.isPresent()) {
            commentRepository.delete(comment.get());
        } else {
            throw new RuntimeException("Comment not found for ID: " + id);
        }
    }

}
