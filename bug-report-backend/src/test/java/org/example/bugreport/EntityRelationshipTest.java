package org.example.bugreport;

import com.example.demo.entities.Bug;
import com.example.demo.entities.Comment;
import com.example.demo.entities.Users;
import com.example.demo.service.BugService;
import com.example.demo.service.CommentService;
import com.example.demo.service.UsersService;
import com.example.demo.BugReportApplication;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(classes = BugReportApplication.class)
@Transactional
public class EntityRelationshipTest {

    @Autowired
    private UsersService usersService;

    @Autowired
    private BugService bugService;

    @Autowired
    private CommentService commentService;

    @Test
    void testUserBugRelationship() {
        // Create user
        Users user = new Users(null, "relationTester", 
            "relation" + System.currentTimeMillis() + "@email.com", "password", "123456789", 0, false, false);
        Users savedUser = usersService.addUser(user);

        // Create bug with user as author
        Bug bug = new Bug();
        bug.setAuthor(savedUser);
        bug.setTitle("Test Bug");
        bug.setDescription("Test Description");
        bug.setCreationDate(ZonedDateTime.now());
        bug.setStatus("NOT SOLVED");
        Bug savedBug = bugService.addBug(bug);

        // Verify relationship
        assertEquals(savedUser.getId(), savedBug.getAuthor().getId());
    }

    @Test
    void testBugCommentRelationship() {
        // Create user
        Users user = new Users(null, "relationTester", 
            "relation" + System.currentTimeMillis() + "@email.com", "password", "123456789", 0, false, false);
        Users savedUser = usersService.addUser(user);

        // Create bug
        Bug bug = new Bug();
        bug.setAuthor(savedUser);
        bug.setTitle("Test Bug");
        bug.setDescription("Test Description");
        bug.setCreationDate(ZonedDateTime.now());
        bug.setStatus("NOT SOLVED");
        Bug savedBug = bugService.addBug(bug);

        // Create comment
        Comment comment = new Comment();
        comment.setAuthor(savedUser);
        comment.setBug(savedBug);
        comment.setText("Test Comment");
        comment.setDate(ZonedDateTime.now());
        Comment savedComment = commentService.addComment(comment);

        // Verify relationships
        assertEquals(savedUser.getId(), savedComment.getAuthor().getId());
        assertEquals(savedBug.getId(), savedComment.getBug().getId());
    }

    @Test
    void testCascadeDelete() {
        // Create user
        Users user = new Users(null, "relationTester", 
            "relation" + System.currentTimeMillis() + "@email.com", "password", "123456789", 0, false, false);
        Users savedUser = usersService.addUser(user);

        // Create bug
        Bug bug = new Bug();
        bug.setAuthor(savedUser);
        bug.setTitle("Test Bug");
        bug.setDescription("Test Description");
        bug.setCreationDate(ZonedDateTime.now());
        bug.setStatus("NOT SOLVED");
        Bug savedBug = bugService.addBug(bug);

        // Create comment and add it to the bug's comments collection
        Comment comment = new Comment();
        comment.setAuthor(savedUser);
        comment.setBug(savedBug);
        comment.setText("Test Comment");
        comment.setDate(ZonedDateTime.now());
        
        // Add the comment to the bug's comments collection
        savedBug.addComment(comment);
        
        // Save the comment
        Comment savedComment = commentService.addComment(comment);
        
        // Verify the comment was saved
        assertNotNull(savedComment.getId());
        
        // Delete bug
        bugService.deleteBugById(savedBug.getId());
        
        // Verify the comment is deleted by checking if findById throws an exception
        try {
            commentService.findById(savedComment.getId());
            fail("Expected ResponseStatusException to be thrown");
        } catch (ResponseStatusException e) {
            assertEquals(404, e.getStatusCode().value());
            assertEquals("Comment not found!", e.getReason());
        }
    }
}