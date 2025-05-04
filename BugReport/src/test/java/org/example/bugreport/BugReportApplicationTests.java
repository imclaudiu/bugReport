//package org.example.bugreport;
//
//import com.example.demo.BugReportApplication;
//import com.example.demo.entities.Bug;
//import com.example.demo.entities.Comment;
//import com.example.demo.entities.Users;
//import com.example.demo.service.BugService;
//import com.example.demo.service.CommentService;
//import com.example.demo.service.UsersService;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.util.Date;
//import java.util.List;
//
//import static org.junit.jupiter.api.Assertions.*;
//
//@SpringBootTest(classes = BugReportApplication.class)
//@Transactional
//public class BugReportApplicationTests {
//
//    @Autowired
//    private BugService bugService;
//
//    @Autowired
//    private UsersService usersService;
//
//    @Autowired
//    private CommentService commentService;
//
//    @Test
//    void contextLoads() {
//        // Verifică încărcarea contextului Spring
//    }
//
//    // 1. Teste pentru utilizatori
//    @Test
//    void testUserCRUD() {
//        // Create a unique email using current timestamp
//        String uniqueEmail = "test" + System.currentTimeMillis() + "@example.com";
//
//        // Create
//        Users testUser = new Users(null, "testUser", uniqueEmail, "password", "123456789", 0, false, false);
//        Users savedUser = usersService.addUser(testUser);
//        assertNotNull(savedUser.getId());
//
//        // Read
//        Users retrievedUser = usersService.getUserById(savedUser.getId());
//        assertNotNull(retrievedUser);
//        assertEquals("testUser", retrievedUser.getUsername());
//
//        // Update
//        retrievedUser.setUsername("updatedUser");
//        Users updatedUser = usersService.updateUser(retrievedUser);
//        assertEquals("updatedUser", updatedUser.getUsername());
//
//        // Delete
//        String deleteMessage = usersService.deleteUserById(savedUser.getId());
//        assertEquals("User has been deleted", deleteMessage);
//        assertNull(usersService.getUserById(savedUser.getId()));
//    }
//
//    // 2. Teste pentru bug-uri
//    @Test
//    void testBugCRUD() {
//        // Creează un utilizator pentru test
//        String uniqueEmail = "bug" + System.currentTimeMillis() + "@example.com";
//        Users testUser = new Users(null, "bugTester", uniqueEmail, "password", "123456789", 0, false, false);
//        Users savedUser = usersService.addUser(testUser);
//
//        // Create
//        Bug testBug = new Bug();
//        testBug.setId(9999);
//        testBug.setAuthor(savedUser);
//        testBug.setTitle("Test Bug");
//        testBug.setDescription("Test Description");
//        testBug.setCreationDate(new Date());
//        testBug.setStatus("NOT SOLVED");
//
//        Bug savedBug = bugService.addBug(testBug);
//        assertEquals(9999, savedBug.getId());
//
//        // Read
//        Bug retrievedBug = bugService.getBugById(savedBug.getId());
//        assertNotNull(retrievedBug);
//        assertEquals("Test Bug", retrievedBug.getTitle());
//
//        // Update
//        retrievedBug.setTitle("Updated Bug Title");
//        Bug updatedBug = bugService.updateBug(retrievedBug);
//        assertEquals("Updated Bug Title", updatedBug.getTitle());
//
//        // Delete
//        bugService.deleteBugById(savedBug.getId());
//        assertNull(bugService.getBugById(savedBug.getId()));
//    }
//
//    // 3. Teste pentru comentarii
//    @Test
//    void testCommentCRUD() {
//        // Creează un utilizator și un bug pentru test
//        String uniqueEmail = "comment" + System.currentTimeMillis() + "@example.com";
//        Users testUser = new Users(null, "commentTester", uniqueEmail, "password", "123456789", 0, false, false);
//        Users savedUser = usersService.addUser(testUser);
//
//        Bug testBug = new Bug();
//        testBug.setId(8888);
//        testBug.setAuthor(savedUser);
//        testBug.setTitle("Comment Test Bug");
//        testBug.setDescription("Comment Test Description");
//        testBug.setCreationDate(new Date());
//        testBug.setStatus("NOT SOLVED");
//        Bug savedBug = bugService.addBug(testBug);
//
//        // Create
//        Comment testComment = new Comment();
//        testComment.setAuthor(savedUser);
//        testComment.setBug(savedBug);
//        testComment.setText("Test Comment");
//        testComment.setDate(new Date());
//
//        Comment savedComment = commentService.addComment(testComment);
//        assertNotNull(savedComment.getId());
//
//        // Read
//        Comment retrievedComment = commentService.findById(savedComment.getId());
//        assertNotNull(retrievedComment);
//        assertEquals("Test Comment", retrievedComment.getText());
//
//        // Update
//        retrievedComment.setText("Updated Comment Text");
//        Comment updatedComment = commentService.updateComment(retrievedComment);
//        assertEquals("Updated Comment Text", updatedComment.getText());
//
//        // Delete
//        commentService.deleteComment(savedComment.getId());
//        assertNull(commentService.findById(savedComment.getId()));
//    }
//
//    // 4. Test pentru relații între entități
//    @Test
//    void testEntityRelationships() {
//        // Creează utilizator
//        String uniqueEmail = "relation" + System.currentTimeMillis() + "@example.com";
//        Users testUser = new Users(null, "relationTester", uniqueEmail, "password", "123456789", 0, false, false);
//        Users savedUser = usersService.addUser(testUser);
//
//        // Creează bug asociat utilizatorului
//        Bug testBug = new Bug();
//        testBug.setId(7777);
//        testBug.setAuthor(savedUser);
//        testBug.setTitle("Relation Test Bug");
//        testBug.setDescription("Relation Test Description");
//        testBug.setCreationDate(new Date());
//        testBug.setStatus("NOT SOLVED");
//        Bug savedBug = bugService.addBug(testBug);
//
//        // Creează comentariu asociat bug-ului și utilizatorului
//        Comment testComment = new Comment();
//        testComment.setAuthor(savedUser);
//        testComment.setBug(savedBug);
//        testComment.setText("Relation Test Comment");
//        testComment.setDate(new Date());
//        Comment savedComment = commentService.addComment(testComment);
//
//        // Verifică relațiile
//        assertEquals(savedUser.getId(), savedBug.getAuthor().getId());
//        assertEquals(savedBug.getId(), savedComment.getBug().getId());
//        assertEquals(savedUser.getId(), savedComment.getAuthor().getId());
//    }
//
//    // Test pentru validarea criptării parolelor utilizatorilor
//    @Test
//    void testPasswordEncryption() {
//        String uniqueEmail = "pwd" + System.currentTimeMillis() + "@example.com";
//        String rawPassword = "testPassword123";
//
//        Users testUser = new Users(null, "pwdTester", uniqueEmail, rawPassword, "123456789", 0, false, false);
//        Users savedUser = usersService.addUser(testUser);
//
//        // Verifică că parola salvată nu este aceeași cu parola originală (e criptată)
//        assertNotEquals(rawPassword, savedUser.getPassword());
//    }
//
//    // Test pentru verificarea unicității email-ului utilizatorilor
//    @Test
//    void testUniqueEmailConstraint() {
//        String uniqueEmail = "unique" + System.currentTimeMillis() + "@example.com";
//
//        // Primul utilizator
//        Users user1 = new Users(null, "user1", uniqueEmail, "password", "123456789", 0, false, false);
//        usersService.addUser(user1);
//
//        // Al doilea utilizator cu același email
//        Users user2 = new Users(null, "user2", uniqueEmail, "password", "987654321", 0, false, false);
//
//        // Ar trebui să arunce o excepție - email deja existent
//        assertThrows(Exception.class, () -> {
//            usersService.addUser(user2);
//        });
//    }
//
//    // Test pentru verificarea listei de bug-uri
//    @Test
//    void testGetAllBugs() {
//        List<Bug> allBugs = bugService.getAllBugs();
//        assertNotNull(allBugs);
//
//        // Creează un bug nou
//        Users testUser = usersService.addUser(new Users(null, "listTester",
//                "list" + System.currentTimeMillis() + "@example.com", "password", "123456789", 0, false, false));
//
//        Bug newBug = new Bug();
//        newBug.setId(6666);
//        newBug.setAuthor(testUser);
//        newBug.setTitle("List Test Bug");
//        newBug.setDescription("List Test Description");
//        newBug.setCreationDate(new Date());
//        newBug.setStatus("NOT SOLVED");
//        bugService.addBug(newBug);
//
//        // Verifică că lista nouă conține un element în plus
//        List<Bug> updatedList = bugService.getAllBugs();
//        assertEquals(allBugs.size() + 1, updatedList.size());
//    }
//}
