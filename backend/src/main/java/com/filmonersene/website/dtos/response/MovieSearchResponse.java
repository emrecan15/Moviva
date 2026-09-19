package com.filmonersene.website.dtos.response;

import java.io.Serializable;

public record MovieSearchResponse(
        Long id,
        Integer tmdbId,
        String movieName,
        String originalTitle,
        String posterUrl,
        String backdropUrl,
        String description,
        String releaseDate,
        Double voteAverage,
        boolean availableForRecommendation
) implements Serializable {
}
