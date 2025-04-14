package org.entities;

import jakarta.persistence.*;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class BugTagId implements Serializable {

    @Column(name = "bugId")
    private Long bugId;

    @Column(name = "tagId")
    private Long tagId;

    // Getters and Setters
    public Long getBugId() {
        return bugId;
    }

    public void setBugId(Long bugId) {
        this.bugId = bugId;
    }

    public Long getTagId() {
        return tagId;
    }

    public void setTagId(Long tagId) {
        this.tagId = tagId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        BugTagId bugTagId = (BugTagId) o;
        return bugId == bugTagId.bugId && tagId == bugTagId.tagId;
    }

    @Override
    public int hashCode() {
        return Objects.hash(bugId, tagId);
    }
}
