package com.filmonersene.website.controllers;

import com.filmonersene.website.annotation.RateLimit;
import com.filmonersene.website.dtos.movielistitem.response.MovieListItemResponse;
import com.filmonersene.website.services.abstracts.MovieListItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('USER','MODERATOR','ADMIN')")
@RequestMapping("/api/lists")
public class MovieListItemController {

    private final MovieListItemService movieListItemService;

    @GetMapping("/{listId}/movies")
    public ResponseEntity<Page<MovieListItemResponse>> getMoviesInList(@AuthenticationPrincipal UserDetails userDetails, Pageable pageable, @PathVariable Long listId){
        return ResponseEntity.ok(movieListItemService.getMoviesInList(userDetails, pageable, listId));
    }

    @PostMapping("/{listId}/movies/{movieId}")
    @RateLimit(maxRequests = 30)
    public ResponseEntity<MovieListItemResponse> addMovieToList(@AuthenticationPrincipal UserDetails userDetails,@PathVariable Long listId, @PathVariable Long movieId){
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(movieListItemService.addMovieToList(userDetails, listId, movieId));
    }

    @DeleteMapping("/{listId}/movies/{movieId}")
    @RateLimit(maxRequests = 30)
    public ResponseEntity<Void> removeMovieFromList(@AuthenticationPrincipal UserDetails userDetails,@PathVariable Long listId,@PathVariable Long movieId){
        movieListItemService.removeMovieFromList(userDetails, listId, movieId);
        return ResponseEntity.noContent().build();
    }


}
