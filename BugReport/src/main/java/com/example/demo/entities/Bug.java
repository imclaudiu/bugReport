package com.example.demo.entities;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "Bug")
public class Bug {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "authorId", nullable = false)
    private Users author;

    @Column(name = "title")
    private String title;

    @Column(name = "description")
    private String description;

    @Column(name = "creationDate")
    private Date creationDate;

    @Column(name = "imageURL")
    private String imageURL;

    @Column(name = "status")
    private String status;

    @Column(name = "voteCount")
    private int voteCount;

    public Bug(Long id, Users author, String title, String description, Date creationDate, String imageURL, String status, int voteCount) {
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

    public Date getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(Date creationDate) {
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
}
