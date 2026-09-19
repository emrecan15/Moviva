package com.filmonersene.website.mapper;

import com.filmonersene.website.dtos.movielistitem.response.MovieListItemResponse;
import com.filmonersene.website.entities.MovieListItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface MovieListItemMapper {


    @Mapping(target = "movieId",source = "movie.id")
    @Mapping(target = "movieName",source = "movie.movieName")
    @Mapping(target = "posterUrl",source = "movie.posterUrl")
    @Mapping(target = "director",source = "movie.director")
    @Mapping(target = "voteAverage",source = "movie.voteAverage")
    @Mapping(target = "genres",source = "movie.genres")
    @Mapping(target = "releaseDate",source = "movie.releaseDate")
    @Mapping(target = "runtime",source = "movie.runtime")
    MovieListItemResponse toResponse(MovieListItem movieListItem);

}
