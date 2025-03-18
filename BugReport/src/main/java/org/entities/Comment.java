package org.entities;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "Comment")
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    @ManyToOne
    @JoinColumn(name = "bugId", nullable = false)
    private Bug bug;

    @ManyToOne
    @JoinColumn(name = "authorId", nullable = false)
    private Users author;

    @Column(name = "text")
    private String text;

    private Date date;
    private String imageURL;
    private int voteCount;

    public Comment(int id, Bug bug, Users author, String text, Date date, String imageURL, int voteCount) {
        this.id = id;
        this.bug = bug;
        this.author = author;
        this.text = text;
        this.date = date;
        this.imageURL = imageURL;
        this.voteCount = voteCount;
    }

    public Comment() {}

    public int getId() {
        return id;
    }

    public void setId(int id) {
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

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
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
}
