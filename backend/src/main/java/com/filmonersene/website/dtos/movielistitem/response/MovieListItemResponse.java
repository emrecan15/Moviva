package com.filmonersene.website.dtos.movielistitem.response;

import com.filmonersene.website.dtos.request.GenreDTO;

import java.time.LocalDateTime;
import java.util.Set;

public record MovieListItemResponse(
        Long id,
        Long movieId,
        String movieName,
        String posterUrl,
        String director,
        Double voteAverage,
        Set<GenreDTO> genres,
        String releaseDate,
        String runtime,
        LocalDateTime createdAt
) {
}
