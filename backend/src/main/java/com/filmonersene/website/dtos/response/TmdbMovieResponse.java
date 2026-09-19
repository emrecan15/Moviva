package com.filmonersene.website.dtos.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public record TmdbMovieResponse(
        Integer id,
        String title,

        @JsonProperty("original_title")
        String originalTitle,

        String overview,

        @JsonProperty("poster_path")
        String posterPath,

        @JsonProperty("backdrop_path")
        String backdropPath,

        @JsonProperty("release_date")
        String releaseDate,

        @JsonProperty("vote_average")
        Double voteAverage,

        @JsonProperty("original_language")
        String originalLanguage,

        Double popularity
) {
}
