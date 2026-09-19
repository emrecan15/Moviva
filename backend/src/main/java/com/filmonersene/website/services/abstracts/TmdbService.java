package com.filmonersene.website.services.abstracts;

import com.filmonersene.website.dtos.response.TmdbMovieDetailResponse;
import com.filmonersene.website.dtos.response.TmdbMovieResponse;

import java.util.List;

public interface TmdbService {
    List<TmdbMovieResponse> searchMovies(String query);
    TmdbMovieDetailResponse getMovieById(int id);



}
