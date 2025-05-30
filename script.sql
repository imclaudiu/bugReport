CREATE TABLE Users (id BIGSERIAL NOT NULL ,username VARCHAR(100) NOT NULL,email VARCHAR(100) NOT NULL UNIQUE,password VARCHAR(100) NOT NULL, token_expiration TIMPESTAMP, token_reset varchar(100),phone VARCHAR(100),score FLOAT(10),isModerator BOOLEAN DEFAULT FALSE,isBanned BOOLEAN DEFAULT FALSE,PRIMARY KEY(id));

CREATE TABLE Bug (id BIGSERIAL NOT NULL,
    userId BIGINT NOT NULL,
    assignedToId BIGINT,
    title VARCHAR(100) NOT NULL, 
    description TEXT NOT NULL, 
    creationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    imageURL VARCHAR, 
    status varchar(20) check(status in ('RECEIVED', 'IN_PROGRESS', 'SOLVED')) NOT NULL DEFAULT 'RECEIVED', 
    voteCount INT DEFAULT 0, 
    PRIMARY KEY(id),
    FOREIGN KEY(userId) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY(assignedToId) REFERENCES Users(id) ON DELETE SET NULL
);

CREATE TABLE Comment (
    id BIGSERIAL NOT NULL,
    bugId BIGINT NOT NULL,
    userId BIGINT NOT NULL,
    text VARCHAR(255) NOT NULL,
    creationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    imageURL VARCHAR,
    parentCommentId BIGINT,
    voteCount INT DEFAULT 0,
    PRIMARY KEY(id),
    FOREIGN KEY(bugId) REFERENCES Bug(id) ON DELETE CASCADE,
    FOREIGN KEY(userId) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY(parentCommentId) REFERENCES Comment(id) ON DELETE CASCADE,
    CONSTRAINT check_parent_not_self CHECK (id != parentCommentId)
);

CREATE TABLE Vote ( id BIGSERIAL NOT NULL, userId BIGINT NOT NULL,targetId BIGINT NOT NULL, targetType VARCHAR(20) NOT NULL CHECK(targetType in ('BUG', 'COMMENT')), voteType varchar(50) NOT NULL check(voteType in ('UPVOTE', 'DOWNVOTE')) ,PRIMARY KEY(id),FOREIGN KEY(userId) REFERENCES Users(id) ON DELETE CASCADE);

CREATE TABLE Tag (id BIGSERIAL NOT NULL, name VARCHAR(100) UNIQUE NOT NULL, PRIMARY KEY(id));

CREATE TABLE BugTag ( 
    bugId BIGINT NOT NULL,
    tagId BIGINT NOT NULL, 
    PRIMARY KEY (bugId, tagId), 
    FOREIGN KEY (bugId) REFERENCES Bug(id) ON DELETE CASCADE, 
    FOREIGN KEY (tagId) REFERENCES Tag(id) ON DELETE CASCADE
);

-- Add indexes for better performance
CREATE INDEX idx_bug_assigned_to ON Bug(assignedToId);
CREATE INDEX idx_bugtag_tag ON BugTag(tagId);
