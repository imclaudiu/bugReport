package com.example.demo.controller;

import com.example.demo.entities.Comment;
import com.example.demo.entities.Users;
import com.example.demo.repository.CommentRepository;
import com.example.demo.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/comment")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping("/addComment")
    public Comment addComment(@RequestBody Comment comment) {
        try{
            return commentService.addComment(comment);
        }
        catch(Exception e){
            throw new RuntimeException("Comment could not be saved");
        }
    }

    @PutMapping("/editComment/{id}")
    public Comment editComment(@PathVariable Long id, @RequestBody Comment comment) {
        Comment comment1 = commentService.findById(id);
        if(comment1 == null){
            throw new RuntimeException("Comment could not be found");
        }

        comment1.setBug(comment.getBug());
        comment1.setAuthor(comment.getAuthor());
        comment1.setText(comment.getText());
        comment1.setDate(comment.getDate());
        comment1.setImageURL(comment.getImageURL());
        comment1.setVoteCount(comment.getVoteCount());

        return this.commentService.updateComment(comment1);
    }

    @GetMapping("/getComment/{id}")
    public Comment getCommentById(@PathVariable Long id) {
        Comment comment = commentService.findById(id);
        if (comment == null) {
            throw new RuntimeException("Comment not found for ID: " + id);
        }
        return comment;
    }

    @GetMapping("/getAllComments")
    public List<Comment> getAllComments() {
        List <Comment> comments = commentService.findAll();
        if(comments.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "There are no users");
        }
        return this.commentService.findAll();
    }

    @DeleteMapping("/deleteComment/{id}")
    public String deleteComment(@PathVariable Long id) {
        Comment comment = commentService.findById(id);
        if (comment == null) {
            throw new RuntimeException("Comment not found for ID: " + id);
        }
        commentService.deleteComment(id);
        return "Comment deleted successfully!";
    }

}



