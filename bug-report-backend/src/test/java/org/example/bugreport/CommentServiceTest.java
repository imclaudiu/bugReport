package org.example.bugreport;

import com.example.demo.BugReportApplication;
import com.example.demo.entities.Bug;
import com.example.demo.entities.Comment;
import com.example.demo.entities.Users;
import com.example.demo.service.BugService;
import com.example.demo.service.CommentService;
import com.example.demo.service.UsersService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(classes = BugReportApplication.class)
@Transactional
public class CommentServiceTest {

    @Autowired
    private CommentService commentService;

    @Autowired
    private BugService bugService;

    @Autowired
    private UsersService usersService;

    private Users testUser;
    private Bug testBug;

    @BeforeEach
    void setUp() {
        testUser = usersService.addUser(new Users(null, "commentTester", 
            "comment" + System.currentTimeMillis() + "@email.com", "password", "123456789", 0, false, false));
        
        Bug bug = new Bug();
        bug.setAuthor(testUser);
        bug.setTitle("Test Bug");
        bug.setDescription("Test Description");
        bug.setCreationDate(ZonedDateTime.now());
        bug.setStatus("NOT SOLVED");
        testBug = bugService.addBug(bug);
    }

    @Test
    void testCreateComment() {
        Comment comment = createTestComment();
        Comment savedComment = commentService.addComment(comment);
        assertNotNull(savedComment.getId());
        assertEquals("Test Comment", savedComment.getText());
    }

    @Test
    void testGetComment() {
        Comment savedComment = commentService.addComment(createTestComment());
        Comment retrievedComment = commentService.findById(savedComment.getId());
        assertNotNull(retrievedComment);
        assertEquals(savedComment.getId(), retrievedComment.getId());
        assertEquals("Test Comment", retrievedComment.getText());
    }

    @Test
    void testUpdateComment() {
        Comment savedComment = commentService.addComment(createTestComment());
        savedComment.setText("Updated Comment");
        Comment updatedComment = commentService.updateComment(savedComment.getId(), savedComment);
        assertEquals("Updated Comment", updatedComment.getText());
    }

    @Test
    void testDeleteComment() {
        // Create and save a test comment
        Comment savedComment = commentService.addComment(createTestComment());
        
        // Verify comment exists before deletion
        assertNotNull(commentService.findById(savedComment.getId()));
        
        // Delete the comment
        String result = commentService.deleteComment(savedComment.getId());
        assertEquals("Comment with ID: " + savedComment.getId() + " has been deleted!", result);
        
        // Verify comment no longer exists - expect 404 exception
        assertThrows(ResponseStatusException.class, () -> {
            commentService.findById(savedComment.getId());
        });
    }
    private Comment createTestComment() {
        Comment comment = new Comment();
        comment.setAuthor(testUser);
        comment.setBug(testBug);
        comment.setText("Test Comment");
        comment.setDate(ZonedDateTime.now());
        return comment;
    }
}