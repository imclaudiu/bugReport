package com.example.demo.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "Vote")
public class Vote {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "userId", nullable = false)
    private Users user;

    @Column(name = "targetId")
    private int targetId;

    @Column(name = "voteType")
    private String voteType;

    public Vote(Long id, Users user, int targetId, String voteType) {
        this.id = id;
        this.user = user;
        this.targetId = targetId;
        if(voteType.equals("UPVOTE") || voteType.equals("DOWNVOTE"))
            this.voteType = voteType;
        else throw new IllegalArgumentException("voteType must be UPVOTE or DOWNVOTE");

    }
    public Vote(){}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Users getUser() {
        return user;
    }

    public void setUser(Users user) {
        this.user = user;
    }

    public int getTargetId() {
        return targetId;
    }

    public void setTargetId(int targetId) {
        this.targetId = targetId;
    }

    public String getVoteType() {
        return voteType;
    }

    public void setVoteType(String voteType) {
        this.voteType = voteType;
    }
}
