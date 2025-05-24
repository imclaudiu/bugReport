-- Add assignedToId column to Bug table if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'bug' AND column_name = 'assignedtoid') THEN
        ALTER TABLE Bug ADD COLUMN assignedToId BIGINT;
        
        -- Add foreign key constraint
        ALTER TABLE Bug ADD CONSTRAINT fk_bug_assigned_to 
            FOREIGN KEY (assignedToId) REFERENCES Users(id) ON DELETE SET NULL;
            
        -- Add index for better performance
        CREATE INDEX IF NOT EXISTS idx_bug_assigned_to ON Bug(assignedToId);
    END IF;
END $$;

-- Create Tag table if it doesn't exist
CREATE TABLE IF NOT EXISTS Tag (
    id BIGSERIAL NOT NULL,
    name VARCHAR(100) UNIQUE NOT NULL,
    PRIMARY KEY(id)
);

-- Create BugTag table if it doesn't exist
CREATE TABLE IF NOT EXISTS BugTag (
    bugId BIGINT NOT NULL,
    tagId BIGINT NOT NULL,
    PRIMARY KEY (bugId, tagId),
    FOREIGN KEY (bugId) REFERENCES Bug(id) ON DELETE CASCADE,
    FOREIGN KEY (tagId) REFERENCES Tag(id) ON DELETE CASCADE
);

-- Add index for better performance if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_bugtag_tag ON BugTag(tagId);

-- Add some default tags if they don't exist
INSERT INTO Tag (name)
SELECT unnest(ARRAY['UI', 'Backend', 'Frontend', 'Database', 'Security', 'Performance', 'Bug', 'Feature', 'Documentation'])
WHERE NOT EXISTS (SELECT 1 FROM Tag);

-- Add comment to help users understand the schema
COMMENT ON TABLE Bug IS 'Stores bug reports with their details and relationships';
COMMENT ON TABLE Tag IS 'Stores available tags for categorizing bugs';
COMMENT ON TABLE BugTag IS 'Junction table for many-to-many relationship between bugs and tags';
COMMENT ON COLUMN Bug.assignedToId IS 'References the user the bug is assigned to. Can be null.'; 