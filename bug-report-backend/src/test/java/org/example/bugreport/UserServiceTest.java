package org.example.bugreport;

import com.example.demo.BugReportApplication;
import com.example.demo.entities.Users;
import com.example.demo.service.UsersService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(classes = BugReportApplication.class)
@Transactional
public class UserServiceTest {

    @Autowired
    private UsersService usersService;

    @Test
    void testCreateUser() {
        Users user = new Users(null, "testUser", 
            "test" + System.currentTimeMillis() + "@email.com",
            "password", "123456789", 0, false, false);
        Users savedUser = usersService.addUser(user);
        assertNotNull(savedUser.getId());
        assertEquals("testUser", savedUser.getUsername());
    }

    @Test
    void testGetUser() {
        Users user = new Users(null, "testUser", 
            "test" + System.currentTimeMillis() + "@email.com",
            "password", "123456789", 0, false, false);
        Users savedUser = usersService.addUser(user);
        
        Users retrievedUser = usersService.getUserById(savedUser.getId());
        assertNotNull(retrievedUser);
        assertEquals(savedUser.getId(), retrievedUser.getId());
        assertEquals("testUser", retrievedUser.getUsername());
    }

    @Test
    void testUpdateUser() {
        Users user = new Users(null, "testUser", 
            "test" + System.currentTimeMillis() + "@email.com",
            "password", "123456789", 0, false, false);
        Users savedUser = usersService.addUser(user);
        
        savedUser.setUsername("updatedUser");
        Users updatedUser = usersService.updateUser(savedUser.getId(), savedUser);
        assertEquals("updatedUser", updatedUser.getUsername());
    }

    @Test
    void testDeleteUser() {
        // Create a test user
        Users user = new Users(null, "testUser", 
            "test" + System.currentTimeMillis() + "@email.com", 
            "password", "123456789", 0, false, false);
        Users savedUser = usersService.addUser(user);
        
        // Verify user exists before deletion
        assertNotNull(usersService.getUserById(savedUser.getId()));
        
        // Delete the user
        String result = usersService.deleteUserById(savedUser.getId());
        assertEquals("User deleted successfully", result);
        
        // Verify user no longer exists - expect 404 exception
        assertThrows(ResponseStatusException.class, () -> {
            usersService.getUserById(savedUser.getId());
        });
    }

    @Test
    void testDuplicateEmail() {
        String email = "test" + System.currentTimeMillis() + "@email.com";
        Users user1 = new Users(null, "user1", email, "password", "123456789", 0, false, false);
        usersService.addUser(user1);

        Users user2 = new Users(null, "user2", email, "password", "987654321", 0, false, false);
        assertThrows(Exception.class, () -> usersService.addUser(user2));
    }
}