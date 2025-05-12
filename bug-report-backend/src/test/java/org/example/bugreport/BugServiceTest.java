package org.example.bugreport;

import com.example.demo.entities.Bug;
import com.example.demo.entities.Users;
import com.example.demo.repository.BugRepository;
import com.example.demo.service.BugService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class BugServiceTest {

    @Mock
    private BugRepository bugRepository;

    @InjectMocks
    private BugService bugService;

    private Bug sampleBug;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        Users user = new Users(); // Replace with WebUser or whatever class you use
        user.setId(1L);
        user.setUsername("Alice");

        sampleBug = new Bug();
        sampleBug.setId(1L);
        sampleBug.setAuthor(user);
        sampleBug.setTitle("Sample Bug");
        sampleBug.setDescription("Bug description");
        sampleBug.setImageURL("http://image.com");
        sampleBug.setStatus("OPEN");
        sampleBug.setVoteCount(5);
        sampleBug.setCreationDate(new Date());
    }

    @Test
    void testAddBug_Success() {
        when(bugRepository.save(sampleBug)).thenReturn(sampleBug);

        Bug result = bugService.addBug(sampleBug);
        assertNotNull(result);
        assertEquals("Sample Bug", result.getTitle());
    }

    @Test
    void testAddBug_Exception() {
        when(bugRepository.save(any(Bug.class))).thenThrow(RuntimeException.class);

        assertThrows(ResponseStatusException.class, () -> bugService.addBug(sampleBug));
    }

    @Test
    void testGetBugById_Found() {
        when(bugRepository.findById(1L)).thenReturn(Optional.of(sampleBug));

        Bug result = bugService.getBugById(1L);
        assertEquals("Alice", result.getAuthor().getUsername());
    }

    @Test
    void testGetBugById_NotFound() {
        when(bugRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class, () -> bugService.getBugById(1L));
    }

    @Test
    void testGetAllBugs_Found() {
        when(bugRepository.findAll()).thenReturn(List.of(sampleBug));

        List<Bug> result = bugService.getAllBugs();
        assertEquals(1, result.size());
    }

    @Test
    void testGetAllBugs_EmptyList() {
        when(bugRepository.findAll()).thenReturn(Collections.emptyList());

        assertThrows(ResponseStatusException.class, () -> bugService.getAllBugs());
    }

    @Test
    void testUpdateBug_Success() {
        Bug updatedBug = new Bug();
        Users userBob = new Users(); // Replace with WebUser if that's your class
        userBob.setId(2L);
        userBob.setUsername("Bob");
        updatedBug.setAuthor(userBob);
        updatedBug.setTitle("Updated Title");
        updatedBug.setDescription("Updated desc");
        updatedBug.setCreationDate(new Date());
        updatedBug.setImageURL("http://new.com");
        updatedBug.setStatus("CLOSED");
        updatedBug.setVoteCount(10);

        when(bugRepository.findById(1L)).thenReturn(Optional.of(sampleBug));
        when(bugRepository.save(any(Bug.class))).thenReturn(sampleBug);

        Bug result = bugService.updateBug(1L, updatedBug);
        assertEquals("Bob", result.getAuthor().getUsername());
        assertEquals("Updated Title", result.getTitle());
    }

    @Test
    void testUpdateBug_NotFound() {
        when(bugRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class, () -> bugService.updateBug(1L, sampleBug));
    }

    @Test
    void testDeleteBugById_Success() {
        when(bugRepository.existsById(1L)).thenReturn(true);
        doNothing().when(bugRepository).deleteById(1L);

        String result = bugService.deleteBugById(1L);
        assertEquals("Bug deleted successfully!", result);
    }

    @Test
    void testDeleteBugById_NotFound() {
        when(bugRepository.existsById(1L)).thenReturn(false);

        assertThrows(ResponseStatusException.class, () -> bugService.deleteBugById(1L));
    }
}

