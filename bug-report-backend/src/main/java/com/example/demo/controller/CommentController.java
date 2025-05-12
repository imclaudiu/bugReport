package com.example.demo.controller;

import com.example.demo.entities.Comment;
import com.example.demo.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Clasa de control al commenturilor. In aceasta clasa se apeleaza serviciile entitatilor.
 * Aceasta clasa trebuie tinuta permanent CURATA! Nu exista logica aici, doar se apeleaza serviciile.
 */

@RestController
@RequestMapping("/comment")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping("/addComment")
    public Comment addComment(@RequestBody Comment comment) {
        return this.commentService.addComment(comment);
    }

    @GetMapping("/getComment/{id}")
    public Comment getCommentById(@PathVariable Long id) {
        return this.commentService.findById(id);
    }

    @GetMapping("/getCommentsByBug/{bugId}")
    public List<Comment> getCommentsByBug(@PathVariable Long bugId) {
        return this.commentService.findByBugId(bugId);
    }

    @GetMapping("/getAllComments")
    public List<Comment> getAllComments() {
        return this.commentService.findAll();
    }

    @PutMapping("/editComment/{id}")
    public Comment editComment(@PathVariable Long id, @RequestBody Comment comment) {
        return this.commentService.updateComment(id,  comment);
    }

    @DeleteMapping("/deleteComment/{id}")
    public String deleteComment(@PathVariable Long id) {
        return commentService.deleteComment(id);
    }
}



