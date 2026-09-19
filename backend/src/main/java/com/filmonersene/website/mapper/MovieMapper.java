package com.filmonersene.website.mapper;

import com.filmonersene.website.dtos.request.GenreDTO;
import com.filmonersene.website.dtos.request.SaveMovieRequest;
import com.filmonersene.website.dtos.response.MovieSearchResponse;
import com.filmonersene.website.dtos.response.RecommendedByDto;
import com.filmonersene.website.entities.Genre;

import com.filmonersene.website.entities.Movie;
import com.filmonersene.website.entities.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.Set;


@Mapper(componentModel = "spring")
public interface MovieMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "genres", ignore = true)
    @Mapping(target = "recommendedBy", ignore = true)
    Movie toEntity(SaveMovieRequest request);

    GenreDTO toGenreDTO(Genre genre);

    Set<GenreDTO> toGenreDTOSet(Set<Genre> genres);

    @Mapping(target = "userId", source = "id")
    @Mapping(target = "tag", source = "tag.name")
    RecommendedByDto toRecommendedByDto(User user);


    MovieSearchResponse toMovieSearchResponse(Movie movie);
}
