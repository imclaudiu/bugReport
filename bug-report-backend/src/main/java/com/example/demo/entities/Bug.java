package com.example.demo.entities;

import jakarta.persistence.*;
import org.apache.catalina.User;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Bug")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Bug {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "userId", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Users author;

    @JsonManagedReference
    @OneToMany(mappedBy = "bug", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();

    @Column(name = "title")
    private String title;

    @Column(name = "description")
    private String description;

    @Column(name = "creationDate")
    private LocalDateTime creationDate;

    @Column(name = "imageURL")
    private String imageURL;

    @Column(name = "status")
    private String status;

    @Column(name = "voteCount")
    private int voteCount;

    public Bug(Long id, Users author, String title, String description, LocalDateTime creationDate, String imageURL, String status, int voteCount) {
        this.id = id;
        this.author = author;
        this.title = title;
        this.description = description;
        this.creationDate = creationDate;
        this.imageURL = imageURL;
        if(status.equals("SOLVED") || status.equals("NOT SOLVED")) {
            this.status = status;
        }else{
            throw new RuntimeException("Status not solved");
        }
        this.voteCount = voteCount;
    }

    public Bug(){}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Users getAuthor() {
        return author;
    }

    public void setAuthor(Users author) {
        this.author = author;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(LocalDateTime creationDate) {
        this.creationDate = creationDate;
    }

    public String getImageURL() {
        return imageURL;
    }

    public void setImageURL(String imageURL) {
        this.imageURL = imageURL;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public int getVoteCount() {
        return voteCount;
    }

    public void setVoteCount(int voteCount) {
        this.voteCount = voteCount;
    }

    public List<Comment> getComments() {
        return comments;
    }

    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }

    public void addComment(Comment comment) {
        comments.add(comment);
        comment.setBug(this);
    }

    public void removeComment(Comment comment) {
        comments.remove(comment);
        comment.setBug(null);
    }
}
