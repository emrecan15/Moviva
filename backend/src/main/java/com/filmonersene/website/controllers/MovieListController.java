package com.filmonersene.website.controllers;

import com.filmonersene.website.annotation.RateLimit;
import com.filmonersene.website.dtos.movielist.request.CreateMovieListRequest;
import com.filmonersene.website.dtos.movielist.request.UpdateMovieListRequest;
import com.filmonersene.website.dtos.movielist.response.MovieListResponse;
import com.filmonersene.website.services.abstracts.MovieListService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
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
@Tag(name = "Movie List Controller", description = "Film listesi oluşturma, getirme ve silme işlemleri")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('USER','MODERATOR','ADMIN')")
@RequestMapping("/api/lists")
public class MovieListController {

    private final MovieListService movieListService;

    @GetMapping
    public ResponseEntity<Page<MovieListResponse>> getMovieLists(@AuthenticationPrincipal UserDetails userDetails, Pageable pageable){
        return ResponseEntity.ok(movieListService.getMovieLists(userDetails,pageable));
    }

    @GetMapping("/{listId}")
    public ResponseEntity<MovieListResponse> getMovieList(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long listId){
        return ResponseEntity.ok(movieListService.getMovieList(userDetails,listId));
    }

    @PostMapping
    @RateLimit(maxRequests = 10)
    public ResponseEntity<MovieListResponse> createMovieList(@AuthenticationPrincipal UserDetails userDetails,@Valid @RequestBody CreateMovieListRequest request){
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(movieListService.createMovieList(userDetails,request));
    }

    @PutMapping("/{listId}")
    @RateLimit(maxRequests = 20)
    public ResponseEntity<MovieListResponse> updateMovieList(@AuthenticationPrincipal UserDetails userDetails,@Valid @RequestBody UpdateMovieListRequest request, @PathVariable Long listId){
        return ResponseEntity.ok(movieListService.updateMovieList(userDetails, request, listId));
    }

    @DeleteMapping("/{listId}")
    @Operation(
            summary = "Film listesi sil",
            description = "Belirtilen ID'ye sahip film listesini siler. Yalnızca listenin sahibi silebilir."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Liste başarıyla silindi"),
            @ApiResponse(responseCode = "401", description = "Giriş yapılmamış / Token geçersiz"),
            @ApiResponse(responseCode = "403", description = "Bu listeyi silmeye yetkiniz yok"),
            @ApiResponse(responseCode = "404", description = "Liste bulunamadı")
    })
    @RateLimit(maxRequests = 10)
    public ResponseEntity<Void> deleteMovieList(@AuthenticationPrincipal UserDetails userDetails,@PathVariable Long listId){
        movieListService.deleteMovieList(userDetails, listId);
        return ResponseEntity.noContent().build();
    }

}
