package org.example.bugreport;

import com.example.demo.entities.Users;
import com.example.demo.repository.UsersRepository;
import com.example.demo.service.UsersService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UsersServiceTest {

    @Mock
    private UsersRepository usersRepository;

    @InjectMocks
    private UsersService usersService;

    private Users sampleUser;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        sampleUser = new Users();
        sampleUser.setId(1L);
        sampleUser.setUsername("Alice");
        sampleUser.setPassword("plaintext");  // parola va fi hashu-ita în add/update
        sampleUser.setEmail("alice@example.com");
        sampleUser.setPhone("1234567890");
        sampleUser.setScore(10);
        sampleUser.setModerator(false);
        sampleUser.setBanned(false);
    }

    @Test
    void testAddUser_Success() {
        when(usersRepository.save(any(Users.class))).thenAnswer(i -> i.getArgument(0));

        Users result = usersService.addUser(sampleUser);

        assertNotNull(result);
        assertEquals("Alice", result.getUsername());
        assertNotEquals("plaintext", result.getPassword()); // Verifică că parola a fost hashu-ita
        assertTrue(result.getPassword().startsWith("$2a$")); // Format bcrypt
    }

    @Test
    void testAddUser_Exception() {
        when(usersRepository.save(any(Users.class))).thenThrow(new RuntimeException("DB error"));

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () -> usersService.addUser(sampleUser));
        assertEquals("226 IM_USED \"DB error\"", ex.getMessage());
    }

    @Test
    void testGetUserById_Found() {
        when(usersRepository.findById(1L)).thenReturn(Optional.of(sampleUser));

        Users result = usersService.getUserById(1L);

        assertEquals("Alice", result.getUsername());
    }

    @Test
    void testGetUserById_NotFound() {
        when(usersRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class, () -> usersService.getUserById(1L));
    }

    @Test
    void testGetAllUsers_Found() {
        when(usersRepository.findAll()).thenReturn(List.of(sampleUser));

        List<Users> result = usersService.getAllUsers();

        assertEquals(1, result.size());
        assertEquals("Alice", result.get(0).getUsername());
    }

    @Test
    void testGetAllUsers_Empty() {
        when(usersRepository.findAll()).thenReturn(Collections.emptyList());

        assertThrows(ResponseStatusException.class, () -> usersService.getAllUsers());
    }

    @Test
    void testUpdateUser_Success() {
        Users updated = new Users();
        updated.setUsername("Bob");
        updated.setPassword("newpass");
        updated.setEmail("bob@example.com");
        updated.setPhone("9876543210");
        updated.setScore(20);
        updated.setModerator(true);
        updated.setBanned(true);

        when(usersRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(usersRepository.save(any(Users.class))).thenAnswer(i -> i.getArgument(0));

        Users result = usersService.updateUser(1L, updated);

        assertEquals("Bob", result.getUsername());
        assertTrue(result.getPassword().startsWith("$2a$"));
        assertTrue(result.isModerator());
        assertTrue(result.isBanned());
    }

    @Test
    void testUpdateUser_NotFound() {
        when(usersRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class, () -> usersService.updateUser(1L, sampleUser));
    }

    @Test
    void testCheckPassword_Correct() {
        String hashedPassword = org.springframework.security.crypto.bcrypt.BCrypt.hashpw("secret", org.springframework.security.crypto.bcrypt.BCrypt.gensalt());
        sampleUser.setPassword(hashedPassword);

        when(usersRepository.findByUsername("Alice")).thenReturn(Optional.of(sampleUser));

        boolean result = usersService.checkPassword("Alice", "secret");

        assertTrue(result);
    }

    @Test
    void testCheckPassword_Incorrect() {
        String hashedPassword = org.springframework.security.crypto.bcrypt.BCrypt.hashpw("secret", org.springframework.security.crypto.bcrypt.BCrypt.gensalt());
        sampleUser.setPassword(hashedPassword);

        when(usersRepository.findByUsername("Alice")).thenReturn(Optional.of(sampleUser));

        boolean result = usersService.checkPassword("Alice", "wrong");

        assertFalse(result);
    }

    @Test
    void testCheckPassword_UserNotFound() {
        when(usersRepository.findByUsername("Alice")).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class, () -> usersService.checkPassword("Alice", "secret"));
    }

    @Test
    void testDeleteUserById_Success() {
        when(usersRepository.existsById(1L)).thenReturn(true);
        doNothing().when(usersRepository).deleteById(1L);

        String result = usersService.deleteUserById(1L);

        assertEquals("User deleted successfully", result);
    }

    @Test
    void testDeleteUserById_NotFound() {
        when(usersRepository.existsById(1L)).thenReturn(false);

        assertThrows(ResponseStatusException.class, () -> usersService.deleteUserById(1L));
    }
}

