package com.example.demo.service;

import com.example.demo.entities.Bug;
import com.example.demo.entities.Comment;
import com.example.demo.entities.Users;
import com.example.demo.repository.BugRepository;
import com.example.demo.repository.CommentRepository;
import com.example.demo.repository.UsersRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * In clasa CommentService a fost implementata logica pentru adaugarea, preluarea, updatarea,
 * respectiv stergerea datelor din tabelul Comment.
 * In aceasta clasa se apeleaza repository-ul pentru a lucra cu baza de date.
 */

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

        if (comment.getParent() != null && comment.getParent().getId() != null) {
            Comment parent = commentRepository.findById(comment.getParent().getId())
                    .orElseThrow(() -> new RuntimeException("Parent comment not found!"));
            comment.setParent(parent);
        }

        if (comment.getDate() == null) {
            comment.setDate(ZonedDateTime.now());
        }

        return commentRepository.save(comment);
    }



    public Comment findById(Long id) {
        Comment comment = this.commentRepository.findById(id).orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found!"));

        return comment;
    }

    public List<Comment> findAll() {

        List<Comment> comments = this.commentRepository.findAll();
        if(comments.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No comments found!");
        }

        return commentRepository.findAll();
    }

    public Comment updateComment(Long id, Comment comment) {
        Comment existingComment = commentRepository.findById(id).orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found!"));
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

        existingComment.setBug(comment.getBug());
        existingComment.setAuthor(comment.getAuthor());
        existingComment.setText(comment.getText());
        existingComment.setDate(comment.getDate());
        existingComment.setImageURL(comment.getImageURL());
        existingComment.setVoteCount(comment.getVoteCount());

        return commentRepository.save(existingComment);
    }

    public String deleteComment(Long id) {
        Comment comment = commentRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found!"));
        commentRepository.delete(comment);
        return  "Comment with ID: " + id + " has been deleted!";
    }

    public List<Comment> findByBugId(Long bugId) {
        List<Comment> allComments = commentRepository.findByBugId(bugId);
        Map<Long, Comment> commentMap = new HashMap<>();
        List<Comment> topLevelComments = new ArrayList<>();

        for (Comment comment : allComments) {
            comment.setReplies(new ArrayList<>()); // Ensure replies list is initialized
            commentMap.put(comment.getId(), comment);
        }

        for (Comment comment : allComments) {
            if (comment.getParent() != null && comment.getParent().getId() != null) {
                Comment parent = commentMap.get(comment.getParent().getId());
                if (parent != null) {
                    parent.getReplies().add(comment);
                }
            } else {
                topLevelComments.add(comment);
            }
        }

        return topLevelComments;
    }

}
