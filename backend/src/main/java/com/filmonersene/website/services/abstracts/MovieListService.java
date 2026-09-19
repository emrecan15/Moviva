package com.filmonersene.website.services.abstracts;


import com.filmonersene.website.dtos.movielist.request.CreateMovieListRequest;
import com.filmonersene.website.dtos.movielist.request.UpdateMovieListRequest;
import com.filmonersene.website.dtos.movielist.response.MovieListResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;

public interface MovieListService {
    Page<MovieListResponse> getMovieLists(UserDetails userDetails, Pageable pageable);
    MovieListResponse getMovieList(UserDetails userDetails, Long listId );
    MovieListResponse createMovieList(UserDetails userDetails,CreateMovieListRequest request);
    MovieListResponse updateMovieList(UserDetails userDetails, UpdateMovieListRequest request, Long listId);
    void deleteMovieList(UserDetails userDetails, Long listId );

}
