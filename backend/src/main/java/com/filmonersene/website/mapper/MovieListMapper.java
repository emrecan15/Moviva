package com.filmonersene.website.mapper;

import com.filmonersene.website.dtos.movielist.request.CreateMovieListRequest;
import com.filmonersene.website.dtos.movielist.request.UpdateMovieListRequest;
import com.filmonersene.website.dtos.movielist.response.MovieListResponse;
import com.filmonersene.website.entities.MovieList;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface MovieListMapper {

    @Mapping(target = "isPublic", source = "public")
    @Mapping(target = "ownerUsername", source = "user.username")
    @Mapping(target = "totalMovies", ignore = true)
    @Mapping(target = "averageRating", ignore = true)
    @Mapping(target = "totalRuntime", ignore = true)
    MovieListResponse toResponse(MovieList movieList);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "public", source = "isPublic")
    MovieList toEntity(CreateMovieListRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "public", source = "isPublic")
    void updateEntity(UpdateMovieListRequest request, @MappingTarget MovieList movieList);
}