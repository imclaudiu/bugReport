package org.example.bugreport;

import com.example.demo.entities.Bug;
import com.example.demo.entities.Comment;
import com.example.demo.entities.Users;
import com.example.demo.repository.BugRepository;
import com.example.demo.repository.CommentRepository;
import com.example.demo.repository.UsersRepository;
import com.example.demo.service.CommentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CommentServiceTest {

    @InjectMocks
    private CommentService commentService;

    @Mock
    private CommentRepository commentRepository;

    @Mock
    private BugRepository bugRepository;

    @Mock
    private UsersRepository usersRepository;

    private Comment sampleComment;
    private Bug sampleBug;
    private Users sampleUser;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        sampleUser = new Users();
        sampleUser.setId(1L);
        sampleUser.setUsername("testuser");

        sampleBug = new Bug();
        sampleBug.setId(1L);
        sampleBug.setTitle("bug title");

        sampleComment = new Comment();
        sampleComment.setId(1L);
        sampleComment.setText("Nice bug!");
        sampleComment.setBug(sampleBug);
        sampleComment.setAuthor(sampleUser);
        sampleComment.setVoteCount(0);
        sampleComment.setImageURL("http://img");
        sampleComment.setDate(new Date());
    }

    @Test
    void testAddComment_Success() {
        when(bugRepository.findById(1L)).thenReturn(Optional.of(sampleBug));
        when(usersRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(commentRepository.save(any(Comment.class))).thenReturn(sampleComment);

        Comment result = commentService.addComment(sampleComment);
        assertNotNull(result);
        assertEquals("Nice bug!", result.getText());
    }

    @Test
    void testAddComment_BugNotFound() {
        when(bugRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> commentService.addComment(sampleComment));
        assertTrue(ex.getMessage().contains("Bug not found"));
    }

    @Test
    void testAddComment_UserNotFound() {
        when(bugRepository.findById(1L)).thenReturn(Optional.of(sampleBug));
        when(usersRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> commentService.addComment(sampleComment));
        assertTrue(ex.getMessage().contains("User not found"));
    }

    @Test
    void testFindById_Success() {
        when(commentRepository.findById(1L)).thenReturn(Optional.of(sampleComment));
        Comment result = commentService.findById(1L);
        assertEquals("Nice bug!", result.getText());
    }

    @Test
    void testFindById_NotFound() {
        when(commentRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class, () -> commentService.findById(1L));
    }

    @Test
    void testFindAll_Success() {
        when(commentRepository.findAll()).thenReturn(List.of(sampleComment));

        List<Comment> result = commentService.findAll();
        assertEquals(1, result.size());
    }

    @Test
    void testFindAll_Empty() {
        when(commentRepository.findAll()).thenReturn(Collections.emptyList());

        assertThrows(ResponseStatusException.class, () -> commentService.findAll());
    }

    @Test
    void testUpdateComment_Success() {
        Comment updated = new Comment();
        updated.setText("Updated comment");
        updated.setBug(sampleBug);
        updated.setAuthor(sampleUser);
        updated.setVoteCount(5);
        updated.setImageURL("http://updated");
        updated.setDate(new Date());

        when(commentRepository.findById(1L)).thenReturn(Optional.of(sampleComment));
        when(bugRepository.findById(1L)).thenReturn(Optional.of(sampleBug));
        when(usersRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(commentRepository.save(any(Comment.class))).thenReturn(updated);

        Comment result = commentService.updateComment(1L, updated);
        assertEquals("Updated comment", result.getText());
    }

    @Test
    void testUpdateComment_NotFound() {
        when(commentRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class, () -> commentService.updateComment(1L, sampleComment));
    }

    @Test
    void testDeleteComment_Success() {
        when(commentRepository.findById(1L)).thenReturn(Optional.of(sampleComment));
        doNothing().when(commentRepository).delete(sampleComment);

        String result = commentService.deleteComment(1L);
        assertEquals("Comment with ID: 1 has been deleted!", result);
    }

    @Test
    void testDeleteComment_NotFound() {
        when(commentRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class, () -> commentService.deleteComment(1L));
    }
}
