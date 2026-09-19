package com.filmonersene.website.services.concretes;

import com.filmonersene.website.dtos.response.TmdbMovieDetailResponse;
import com.filmonersene.website.dtos.response.TmdbMovieResponse;
import com.filmonersene.website.dtos.response.TmdbSearchResponse;
import com.filmonersene.website.entities.Movie;
import com.filmonersene.website.repositories.MovieRepository;
import com.filmonersene.website.services.abstracts.TmdbService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;

@Service
@RequiredArgsConstructor

public class TmdbManager implements TmdbService {

    private final RestClient tmdbClient;


    @Value("${tmdb.api-key}")
    private String apiKey;

    @Override
    public List<TmdbMovieResponse> searchMovies(String query) {

       TmdbSearchResponse response = tmdbClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/search/movie")
                        .queryParam("api_key",apiKey)
                        .queryParam("query",query)
                        .queryParam("language", "tr-TR")
                        .queryParam("include_adult", false)
                        .queryParam("page",1)
                        .build())
                .retrieve()
                .body(TmdbSearchResponse.class);

        return response.results();
    }

    @Override
    public TmdbMovieDetailResponse getMovieById(int id) {

        return tmdbClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/movie/{id}")
                        .queryParam("api_key", apiKey)
                        .queryParam("language", "tr-TR")
                        .queryParam("append_to_response", "credits")
                        .build(id))
                .retrieve()
                .body(TmdbMovieDetailResponse.class);
    }



}
