package com.example.demo.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "BugTag")
public class BugTag {

    @EmbeddedId
    private BugTagId id;

    @ManyToOne
    @JoinColumn(name = "bugId", insertable = false, updatable = false)
    private Bug bug;

    @ManyToOne
    @JoinColumn(name = "tagId", insertable = false, updatable = false)
    private Tag tag;

    public BugTagId getId() {
        return id;
    }

    public void setId(BugTagId id) {
        this.id = id;
    }

    public Bug getBug() {
        return bug;
    }

    public void setBug(Bug bug) {
        this.bug = bug;
    }

    public Tag getTag() {
        return tag;
    }

    public void setTag(Tag tag) {
        this.tag = tag;
    }
}
