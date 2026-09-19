package com.filmonersene.website.dtos.response;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record TmdbMovieDetailResponse( Integer id,

                                       String title,

                                       @JsonProperty("original_title")
                                       String originalTitle,

                                       @JsonProperty("poster_path")
                                       String posterPath,

                                       @JsonProperty("backdrop_path")
                                       String backdropPath,

                                       String overview,

                                       @JsonProperty("release_date")
                                       String releaseDate,

                                       @JsonProperty("vote_average")
                                       Double voteAverage,

                                       Integer runtime,

                                       @JsonProperty("original_language")
                                       String originalLanguage,

                                       @JsonProperty("imdb_id")
                                       String imdbId,

                                       @JsonProperty("origin_country")
                                       List<String> originCountry,

                                       Double popularity,

                                       String tagline,
                                       TmdbCreditsResponse credits,

                                       @JsonProperty("production_countries")
                                       List<TmdbProductionCountryResponse> productionCountries,


                                       List<TmdbGenreResponse> genres) {
}
