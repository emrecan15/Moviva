package com.filmonersene.website.services.concretes;

import com.filmonersene.website.dtos.movielist.request.CreateMovieListRequest;
import com.filmonersene.website.dtos.movielist.request.UpdateMovieListRequest;
import com.filmonersene.website.dtos.movielist.response.MovieListResponse;
import com.filmonersene.website.entities.MovieList;
import com.filmonersene.website.entities.User;
import com.filmonersene.website.exceptions.ResourceAccessDeniedException;
import com.filmonersene.website.exceptions.ResourceNotFoundException;
import com.filmonersene.website.exceptions.UserNotFoundException;
import com.filmonersene.website.mapper.MovieListMapper;
import com.filmonersene.website.repositories.MovieListItemRepository;
import com.filmonersene.website.repositories.MovieListRepository;
import com.filmonersene.website.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class MovieListManagerTest {

    @Mock
    private MovieListRepository movieListRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private MovieListMapper movieListMapper;

    @Mock
    private MovieListItemRepository movieListItemRepository;

    @InjectMocks
    private MovieListManager movieListManager;

    @Test
    void createMovieList_shouldCreateListSuccessfully() {
        UserDetails userDetails = mock(UserDetails.class);
        CreateMovieListRequest request = new CreateMovieListRequest("Favorilerim", true);

        User user = new User();
        user.setId(1L);
        user.setUsername("test@test.com");

        when(userDetails.getUsername()).thenReturn("test@test.com");
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));

        MovieList movieList = new MovieList();
        movieList.setId(1L);
        movieList.setName("Favorilerim");
        movieList.setUser(user);
        movieList.setPublic(true);

        when(movieListMapper.toEntity(request)).thenReturn(movieList);
        when(movieListRepository.save(movieList)).thenReturn(movieList);

        MovieListResponse movieListResponse = new MovieListResponse(
                1L, "Favorilerim", "Açıklama", null, true, "Emre", 0, 0.0, "0s"
        );

        when(movieListMapper.toResponse(movieList)).thenReturn(movieListResponse);

        MovieListResponse result = movieListManager.createMovieList(userDetails, request);

        assertEquals("Favorilerim", result.name());
        assertTrue(result.isPublic());
        assertEquals(1L, result.id());

        verify(userRepository).findByEmail("test@test.com");
        verify(movieListMapper).toEntity(request);
        verify(movieListRepository).save(movieList);
        verify(movieListMapper).toResponse(movieList);
    }

    @Test
    void createMovieList_shouldThrowUserNotFoundExceptionWhenUserDoesNotExist() {
        UserDetails userDetails = mock(UserDetails.class);
        CreateMovieListRequest request = new CreateMovieListRequest("Favorilerim", true);

        when(userDetails.getUsername()).thenReturn("test@test.com");
        when(userRepository.findByEmail(userDetails.getUsername())).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> {
            movieListManager.createMovieList(userDetails, request);
        });

        verify(userRepository).findByEmail(userDetails.getUsername());
    }

    @Test
    void createMovieList_shouldCallMapperToEntity() {
        UserDetails userDetails = mock(UserDetails.class);
        CreateMovieListRequest request = new CreateMovieListRequest("Favorilerim", true);

        when(userDetails.getUsername()).thenReturn("test@test.com");

        User user = new User();
        user.setId(1L);
        user.setUsername("test@test.com");

        when(userRepository.findByEmail(userDetails.getUsername())).thenReturn(Optional.of(user));

        MovieList movieList = new MovieList();
        when(movieListMapper.toEntity(request)).thenReturn(movieList);

        movieListManager.createMovieList(userDetails, request);

        verify(movieListMapper).toEntity(request);
    }

    @Test
    void updateMovieList_shouldUpdateSuccessfully() {
        UserDetails userDetails = mock(UserDetails.class);
        UpdateMovieListRequest request = new UpdateMovieListRequest("Favorilerim", true);
        Long listId = 1L;

        when(userDetails.getUsername()).thenReturn("test@test.com");

        User user = new User();
        user.setId(1L);
        user.setUsername("test@test.com");

        when(userRepository.findByEmail(userDetails.getUsername())).thenReturn(Optional.of(user));

        MovieList movieList = new MovieList();
        movieList.setId(1L);
        movieList.setName("eski liste");
        movieList.setPublic(false);
        movieList.setUser(user);

        when(movieListRepository.findById(listId)).thenReturn(Optional.of(movieList));
        when(movieListRepository.save(movieList)).thenReturn(movieList);

        MovieListResponse response = new MovieListResponse(
                1L, "Favorilerim", "Açıklama", null, true, "Emre", 0, 0.0, "0s"
        );

        when(movieListMapper.toResponse(movieList)).thenReturn(response);

        MovieListResponse result = movieListManager.updateMovieList(userDetails, request, listId);

        assertEquals("Favorilerim", result.name());
        assertTrue(result.isPublic());
        assertEquals(1L, result.id());

        verify(movieListMapper).updateEntity(request, movieList);
        verify(movieListRepository).save(movieList);
    }

    @Test
    void updateMovieList_shouldThrowResourceNotFoundException_whenMovieListNotFound() {
        UserDetails userDetails = mock(UserDetails.class);
        UpdateMovieListRequest request = new UpdateMovieListRequest("Favorilerim", true);
        Long listId = 99L;

        when(userDetails.getUsername()).thenReturn("test@test.com");

        User user = new User();
        user.setId(1L);
        user.setUsername("test@test.com");

        when(userRepository.findByEmail(userDetails.getUsername())).thenReturn(Optional.of(user));
        when(movieListRepository.findById(listId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            movieListManager.updateMovieList(userDetails, request, listId);
        });

        verify(movieListRepository).findById(listId);
        verify(movieListMapper, never()).updateEntity(any(), any());
        verify(movieListRepository, never()).save(any());
    }

    @Test
    void updateMovieList_shouldThrowResourceAccessDeniedException_whenUserIsNotOwner() {
        UserDetails userDetails = mock(UserDetails.class);
        UpdateMovieListRequest request = new UpdateMovieListRequest("Favorilerim", true);
        Long listId = 10L;

        when(userDetails.getUsername()).thenReturn("test@test.com");

        User user = new User();
        user.setId(1L);
        user.setUsername("test@test.com");

        when(userRepository.findByEmail(userDetails.getUsername())).thenReturn(Optional.of(user));

        User ownerUser = new User();
        ownerUser.setId(2L);

        MovieList movieList = new MovieList();
        movieList.setId(listId);
        movieList.setName("Favorilerim");
        movieList.setPublic(true);
        movieList.setUser(ownerUser);

        when(movieListRepository.findById(listId)).thenReturn(Optional.of(movieList));

        assertThrows(ResourceAccessDeniedException.class, () -> {
            movieListManager.updateMovieList(userDetails, request, listId);
        });

        verify(movieListRepository, never()).save(any());
    }

    @Test
    void getMovieList_shouldReturnMovieListSuccessfully_whenUserIsOwner() {
        UserDetails userDetails = mock(UserDetails.class);
        Long listId = 10L;

        when(userDetails.getUsername()).thenReturn("test@test.com");

        User user = new User();
        user.setId(1L);
        user.setUsername("test@test.com");

        when(userRepository.findByEmail(user.getUsername())).thenReturn(Optional.of(user));

        MovieList movieList = new MovieList();
        movieList.setId(listId);
        movieList.setName("Favorilerim");
        movieList.setDescription("Favori filmlerim");
        movieList.setPublic(true);
        movieList.setUser(user);

        when(movieListRepository.findById(listId)).thenReturn(Optional.of(movieList));

        when(movieListItemRepository.countByMovieListId(listId)).thenReturn(3);
        when(movieListItemRepository.getAverageRatingByListId(listId)).thenReturn(8.6);
        when(movieListItemRepository.findRuntimesByListId(listId)).thenReturn(List.of("120dk", "60dk"));

        MovieListResponse result = movieListManager.getMovieList(userDetails, listId);

        assertEquals("Favorilerim", result.name());
        assertEquals("Favori filmlerim", result.description());
        assertEquals(10L, result.id());
        assertTrue(result.isPublic());
        assertEquals("test@test.com", result.ownerUsername());
        assertEquals(3, result.totalMovies());
        assertEquals(8.6, result.averageRating());
        assertEquals("3s", result.totalRuntime());

        verify(userRepository).findByEmail(user.getUsername());
        verify(movieListRepository).findById(listId);
        verify(movieListItemRepository).countByMovieListId(listId);
        verify(movieListItemRepository).getAverageRatingByListId(listId);
        verify(movieListItemRepository).findRuntimesByListId(listId);
        verify(movieListMapper, never()).toResponse(any());
    }

    @Test
    void getMovieList_shouldThrowUserNotFoundException_whenUserIsNotFound() {
        UserDetails userDetails = mock(UserDetails.class);
        Long listId = 10L;
        when(userDetails.getUsername()).thenReturn("test@test.com");
        when(userRepository.findByEmail(userDetails.getUsername())).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> {
            movieListManager.getMovieList(userDetails, listId);
        });

        verify(userRepository).findByEmail(userDetails.getUsername());
        verify(movieListRepository, never()).findById(any());
        verifyNoInteractions(movieListItemRepository);
    }

    @Test
    void getMovieList_shouldThrowResourceNotFoundException_whenMovieListIsNotFound() {
        UserDetails userDetails = mock(UserDetails.class);
        Long listId = 10L;
        when(userDetails.getUsername()).thenReturn("test@test.com");

        User user = new User();
        user.setId(1L);
        user.setUsername("test@test.com");

        when(userRepository.findByEmail(userDetails.getUsername())).thenReturn(Optional.of(user));
        when(movieListRepository.findById(listId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            movieListManager.getMovieList(userDetails, listId);
        });

        verify(userRepository).findByEmail(userDetails.getUsername());
        verify(movieListRepository).findById(listId);
        verifyNoInteractions(movieListItemRepository);
    }

    @Test
    void getMovieList_shouldThrowResourceAccessDeniedException_whenUserIsNotOwner() {
        UserDetails userDetails = mock(UserDetails.class);
        Long listId = 10L;

        when(userDetails.getUsername()).thenReturn("test@test.com");

        User user = new User();
        user.setId(1L);

        when(userRepository.findByEmail(userDetails.getUsername())).thenReturn(Optional.of(user));

        User owner = new User();
        owner.setId(2L);

        MovieList movieList = new MovieList();
        movieList.setId(listId);
        movieList.setUser(owner);

        when(movieListRepository.findById(listId)).thenReturn(Optional.of(movieList));

        assertThrows(ResourceAccessDeniedException.class, () -> {
            movieListManager.getMovieList(userDetails, listId);
        });

        verify(userRepository).findByEmail(userDetails.getUsername());
        verify(movieListRepository).findById(listId);
        verifyNoInteractions(movieListItemRepository);
    }

    @Test
    void getMovieLists_shouldReturnMovieListsSuccessfully_whenUserIsOwner() {
        UserDetails userDetails = mock(UserDetails.class);

        when(userDetails.getUsername()).thenReturn("test@test.com");

        User user = new User();
        user.setId(1L);

        when(userRepository.findByEmail(userDetails.getUsername())).thenReturn(Optional.of(user));

        MovieList movieList = new MovieList();
        movieList.setId(1L);
        movieList.setName("List1");
        movieList.setUser(user);

        MovieList movieList1 = new MovieList();
        movieList1.setId(2L);
        movieList1.setName("List2");
        movieList1.setUser(user);

        List<MovieList> movieLists = List.of(movieList, movieList1);
        Pageable pageable = PageRequest.of(0, 10);

        Page<MovieList> movieListPage = new PageImpl<>(movieLists, pageable, movieLists.size());

        when(movieListRepository.findByUser(user, pageable)).thenReturn(movieListPage);

        MovieListResponse res1 = new MovieListResponse(1L, "List1", "Açıklama 1", null, true, "Emre", 0, 0.0, "0s");
        MovieListResponse res2 = new MovieListResponse(2L, "List2", "Açıklama 2", null, true, "Emre", 0, 0.0, "0s");

        when(movieListMapper.toResponse(movieList)).thenReturn(res1);
        when(movieListMapper.toResponse(movieList1)).thenReturn(res2);

        Page<MovieListResponse> result = movieListManager.getMovieLists(userDetails, pageable);

        assertNotNull(result);
        assertEquals(2, result.getTotalElements());
        assertEquals(1L, result.getContent().get(0).id());
        assertEquals("List1", result.getContent().get(0).name());
        assertEquals(2L, result.getContent().get(1).id());
        assertEquals("List2", result.getContent().get(1).name());

        verify(userRepository).findByEmail(userDetails.getUsername());
        verify(movieListRepository).findByUser(user, pageable);
        verify(movieListMapper, times(2)).toResponse(any(MovieList.class));
    }

    @Test
    void getMovieLists_shouldThrowUserNotFoundException_whenUserIsNotFound() {
        UserDetails userDetails = mock(UserDetails.class);
        Pageable pageable = PageRequest.of(0, 10);

        when(userDetails.getUsername()).thenReturn("test@test.com");
        when(userRepository.findByEmail(userDetails.getUsername())).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> {
            movieListManager.getMovieLists(userDetails, pageable);
        });

        verify(userRepository).findByEmail(userDetails.getUsername());
        verify(movieListRepository, never()).findByUser(any(), any());
        verify(movieListMapper, never()).toResponse(any());
    }

    @Test
    void deleteMovieList_shouldDeleteMovieListSuccessfully_whenUserIsOwner() {
        UserDetails userDetails = mock(UserDetails.class);
        Long listId = 10L;

        when(userDetails.getUsername()).thenReturn("test@test.com");

        User user = new User();
        user.setId(1L);

        when(userRepository.findByEmail(userDetails.getUsername())).thenReturn(Optional.of(user));

        MovieList movieList = new MovieList();
        movieList.setId(listId);
        movieList.setUser(user);

        when(movieListRepository.findById(listId)).thenReturn(Optional.of(movieList));

        movieListManager.deleteMovieList(userDetails, listId);

        verify(userRepository).findByEmail(userDetails.getUsername());
        verify(movieListRepository).findById(listId);
        verify(movieListRepository).deleteById(listId);
    }

    @Test
    void deleteMovieList_shouldThrowUserNotFoundException_whenUserIsNotFound() {
        UserDetails userDetails = mock(UserDetails.class);
        Long listId = 10L;

        when(userDetails.getUsername()).thenReturn("test@test.com");
        when(userRepository.findByEmail(userDetails.getUsername())).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> {
            movieListManager.deleteMovieList(userDetails, listId);
        });

        verify(userRepository).findByEmail(any());
        verify(movieListRepository, never()).findById(any());
        verify(movieListRepository, never()).deleteById(any());
    }

    @Test
    void deleteMovieList_shouldThrowResourceNotFoundException_whenMovieListIsNotFound() {
        UserDetails userDetails = mock(UserDetails.class);
        Long listId = 10L;

        when(userDetails.getUsername()).thenReturn("test@test.com");

        User user = new User();
        user.setId(1L);

        when(userRepository.findByEmail(userDetails.getUsername())).thenReturn(Optional.of(user));
        when(movieListRepository.findById(listId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            movieListManager.deleteMovieList(userDetails, listId);
        });

        verify(userRepository).findByEmail(any());
        verify(movieListRepository).findById(any());
        verify(movieListRepository, never()).deleteById(any());
    }

    @Test
    void deleteMovieList_shouldThrowResourceAccessDeniedException_whenUserIsNotOwner() {
        UserDetails userDetails = mock(UserDetails.class);
        Long listId = 10L;

        when(userDetails.getUsername()).thenReturn("test@test.com");

        User user = new User();
        user.setId(1L);

        when(userRepository.findByEmail(userDetails.getUsername())).thenReturn(Optional.of(user));

        User owner = new User();
        owner.setId(2L);

        MovieList movieList = new MovieList();
        movieList.setId(1L);
        movieList.setUser(owner);

        when(movieListRepository.findById(listId)).thenReturn(Optional.of(movieList));

        assertThrows(ResourceAccessDeniedException.class, () -> {
            movieListManager.deleteMovieList(userDetails, listId);
        });

        verify(userRepository).findByEmail(any());
        verify(movieListRepository).findById(any());
        verify(movieListRepository, never()).deleteById(any());
    }
}