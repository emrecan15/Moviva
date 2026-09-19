package com.filmonersene.website.services.concretes;

import com.filmonersene.website.dtos.movielistitem.response.MovieListItemResponse;
import com.filmonersene.website.entities.Movie;
import com.filmonersene.website.entities.MovieList;
import com.filmonersene.website.entities.MovieListItem;
import com.filmonersene.website.entities.User;
import com.filmonersene.website.exceptions.MovieListItemAlreadyExistsException;
import com.filmonersene.website.exceptions.ResourceAccessDeniedException;
import com.filmonersene.website.exceptions.ResourceNotFoundException;
import com.filmonersene.website.exceptions.UserNotFoundException;
import com.filmonersene.website.mapper.MovieListItemMapper;
import com.filmonersene.website.repositories.MovieListItemRepository;
import com.filmonersene.website.repositories.MovieListRepository;
import com.filmonersene.website.repositories.MovieRepository;
import com.filmonersene.website.repositories.UserRepository;
import com.filmonersene.website.services.abstracts.MovieListItemService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MovieListItemManager implements MovieListItemService {

    private final MovieListItemRepository movieListItemRepository;
    private final MovieListRepository movieListRepository;
    private final UserRepository userRepository;
    private final MovieRepository movieRepository;
    private final MovieListItemMapper movieListItemMapper;



    @Override
    public Page<MovieListItemResponse> getMoviesInList(UserDetails userDetails, Pageable pageable, Long listId) {
        User user = getUserFromUserDetails(userDetails);
        MovieList movieList =  movieListRepository.findById(listId).orElseThrow(() -> new ResourceNotFoundException("Hedef liste bulunamadı."));
        if (!movieList.getUser().getId().equals(user.getId()))
        {
            throw new ResourceAccessDeniedException("Bu kaynağa erişim yetkiniz yok.");
        }

        Page<MovieListItem> movieListItem = movieListItemRepository.findByMovieListId(listId,pageable);

        return movieListItem.map(movieListItemMapper::toResponse);
    }

    @Override
    @Transactional
    public MovieListItemResponse addMovieToList(UserDetails userDetails, Long listId, Long movieId) {
        User user = getUserFromUserDetails(userDetails);
        MovieList movieList = movieListRepository.findById(listId).orElseThrow(() -> new ResourceNotFoundException("Hedef kaynak bulunamadı."));
        if (!movieList.getUser().getId().equals(user.getId()))
        {
            throw new ResourceAccessDeniedException("Bu listeye erişim yetkiniz yok.");
        }
        Movie movie = movieRepository.findById(movieId).orElseThrow(() -> new ResourceNotFoundException("Hedef kaynak bulunamadı."));

        boolean exists = movieListItemRepository.existsByMovieList_IdAndMovie_Id(listId, movieId);
        if (exists)
        {
            throw new MovieListItemAlreadyExistsException("Bu film zaten listede.");
        }

        MovieListItem movieListItem = new MovieListItem();
        movieListItem.setMovieList(movieList);
        movieListItem.setMovie(movie);

        MovieListItem response = movieListItemRepository.save(movieListItem);

        return movieListItemMapper.toResponse(response);
    }


    @Override
    @Transactional
    public void removeMovieFromList(UserDetails userDetails, Long listId, Long movieId) {

        User user = getUserFromUserDetails(userDetails);

        MovieList movieList = movieListRepository.findById(listId).orElseThrow(()-> new ResourceNotFoundException("Hedef kaynak bulunamadı."));

        if (!movieList.getUser().getId().equals(user.getId()))
        {
            throw new ResourceAccessDeniedException("Bu liste üzerinde işlem yapma yetkiniz yok.");
        }

        long deletedRows = movieListItemRepository.deleteByMovieList_IdAndMovie_Id(listId, movieId);

        if (deletedRows == 0) {
            throw new ResourceNotFoundException("Film bu listede bulunamadı.");
        }

    }

    private User getUserFromUserDetails(UserDetails userDetails){
        return userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new UserNotFoundException("Kullanıcı bulunamadı."));
    }
}
