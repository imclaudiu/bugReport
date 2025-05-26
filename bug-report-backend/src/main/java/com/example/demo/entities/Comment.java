package com.example.demo.entities;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "Comment")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bugId", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Bug bug;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Users author;

    @Column(name = "text")
    private String text;

    @Column(name = "creationDate")
    private ZonedDateTime date;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parentCommentId")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "replies"})
    private Comment parent;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "parent"})
    private List<Comment> replies = new ArrayList<>();

    private String imageURL;
    private int voteCount;

    public Comment(Long id, Bug bug, Users author, String text, ZonedDateTime date, String imageURL, int voteCount, Comment parent) {
        this.id = id;
        this.bug = bug;
        this.author = author;
        this.text = text;
        this.date = date;
        this.imageURL = imageURL;
        this.voteCount = voteCount;
        this.parent = parent;
    }

    public Comment getParent() {
        return parent;
    }

    public void setParent(Comment parent) {
        this.parent = parent;
    }

    public Comment() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Bug getBug() {
        return bug;
    }

    public void setBug(Bug bug) {
        this.bug = bug;
    }

    public Users getAuthor() {
        return author;
    }

    public void setAuthor(Users author) {
        this.author = author;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public ZonedDateTime getDate() {
        return date;
    }

    public void setDate(ZonedDateTime date) {
        this.date = date;
    }

    public String getImageURL() {
        return imageURL;
    }

    public void setImageURL(String imageURL) {
        this.imageURL = imageURL;
    }

    public int getVoteCount() {
        return voteCount;
    }

    public void setVoteCount(int voteCount) {
        this.voteCount = voteCount;
    }

    public List<Comment> getReplies() {
        return replies;
    }

    public void setReplies(List<Comment> replies) {
        this.replies = replies;
    }

    public void addReply(Comment reply) {
        replies.add(reply);
        reply.setParent(this);
    }

    public void removeReply(Comment reply) {
        replies.remove(reply);
        reply.setParent(null);
    }
}
