package com.filmonersene.website.dtos.movielist.response;

import java.time.LocalDateTime;


public record MovieListResponse(
        Long id,
        String name,
        String description,
        LocalDateTime createdAt,
        boolean isPublic,
        String ownerUsername,
        int totalMovies,
        Double averageRating,
        String totalRuntime
) {
}
