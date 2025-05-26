package com.example.demo.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "Vote")
public class Vote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "userId", nullable = false)
    private Users user;

    @Column(name = "targetId", nullable = false)
    private int targetId;

    @Column(name = "targetType", nullable = false)
    private String targetType; // "BUG" sau "COMMENT"

    @Column(name = "voteType", nullable = false)
    private String voteType; // "UPVOTE" sau "DOWNVOTE"

    public Vote(Long id, Users user, int targetId, String voteType, String targetType) {
        this.id = id;
        this.user = user;
        this.targetId = targetId;
        if(voteType.equals("UPVOTE") || voteType.equals("DOWNVOTE"))
            this.voteType = voteType;
        else throw new IllegalArgumentException("voteType must be UPVOTE or DOWNVOTE");

        if(targetType.equals("BUG") || targetType.equals("COMMENT")){
            this.targetType = targetType;
        }
        else{
            throw new IllegalArgumentException("targetType must be BUG or COMMENT");
        }

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

    public String getTargetType() {
        return targetType;
    }

    public void setTargetType(String targetType) {
        this.targetType = targetType;
    }

    public void setVoteType(String voteType) {
        this.voteType = voteType;
    }
}
