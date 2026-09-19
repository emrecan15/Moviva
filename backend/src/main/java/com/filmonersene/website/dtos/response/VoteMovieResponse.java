package com.filmonersene.website.dtos.response;

public record VoteMovieResponse(
                                long likes,
                                long dislikes,
                                boolean liked,
                                boolean disliked) {
}
