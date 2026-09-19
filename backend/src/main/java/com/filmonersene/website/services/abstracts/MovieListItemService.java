package com.filmonersene.website.services.abstracts;

import com.filmonersene.website.dtos.movielistitem.response.MovieListItemResponse;
import com.filmonersene.website.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;

public interface MovieListItemService {
    Page<MovieListItemResponse> getMoviesInList(UserDetails userDetails, Pageable pageable,Long listId);
    MovieListItemResponse addMovieToList(UserDetails userDetails, Long listId, Long movieId);
    void removeMovieFromList(UserDetails userDetails, Long listId, Long movieId);
}
