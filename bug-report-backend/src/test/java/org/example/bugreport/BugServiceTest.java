package org.example.bugreport;

import com.example.demo.BugReportApplication;
import com.example.demo.entities.Bug;
import com.example.demo.entities.Users;
import com.example.demo.service.BugService;
import com.example.demo.service.UsersService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(classes = BugReportApplication.class)
@Transactional
public class BugServiceTest {

    @Autowired
    private BugService bugService;

    @Autowired
    private UsersService usersService;

    private Users testUser;

    @BeforeEach
    void setUp() {
        testUser = usersService.addUser(new Users(null, "bugTester", 
            "bug" + System.currentTimeMillis() + "@email.com", "password", "123456789", 0, false, false));
    }

    @Test
    void testCreateBug() {
        Bug bug = createTestBug();
        Bug savedBug = bugService.addBug(bug);
        assertNotNull(savedBug.getId());
        assertEquals("Test Bug", savedBug.getTitle());
    }

    @Test
    void testGetBug() {
        Bug savedBug = bugService.addBug(createTestBug());
        Bug retrievedBug = bugService.getBugById(savedBug.getId());
        assertNotNull(retrievedBug);
        assertEquals(savedBug.getId(), retrievedBug.getId());
        assertEquals("Test Bug", retrievedBug.getTitle());
    }

    @Test
    void testUpdateBug() {
        Bug savedBug = bugService.addBug(createTestBug());
        savedBug.setTitle("Updated Bug");
        Bug updatedBug = bugService.updateBug(savedBug.getId(), savedBug);
        assertEquals("Updated Bug", updatedBug.getTitle());
    }

    @Test
    void testDeleteBug() {
        // Create and save a test bug
        Bug savedBug = bugService.addBug(createTestBug());
        
        // Verify bug exists before deletion
        assertNotNull(bugService.getBugById(savedBug.getId()));
        
        // Delete the bug
        String result = bugService.deleteBugById(savedBug.getId());
        assertEquals("Bug deleted successfully!", result);
        
        // Verify bug no longer exists - expect 404 exception
        assertThrows(ResponseStatusException.class, () -> {
            bugService.getBugById(savedBug.getId());
        });
    }

    private Bug createTestBug() {
        Bug bug = new Bug();
        bug.setAuthor(testUser);
        bug.setTitle("Test Bug");
        bug.setDescription("Test Description");
        bug.setCreationDate(LocalDateTime.now());
        bug.setStatus("NOT SOLVED");
        return bug;
    }
}