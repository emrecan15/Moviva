package com.filmonersene.website.controllers;

import com.filmonersene.website.annotation.RateLimit;
import com.filmonersene.website.dtos.request.SaveMovieRequest;
import com.filmonersene.website.dtos.response.*;
import com.filmonersene.website.services.abstracts.MovieService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
@RequiredArgsConstructor
public class MovieController {

	private final MovieService movieService;

	@PreAuthorize("hasAnyRole('USER','MODERATOR','ADMIN')")
	@PostMapping("/save")
	@RateLimit(maxRequests = 20)
	public ResponseEntity<SaveMovieResponse> saveMovie(@Valid @RequestBody SaveMovieRequest saveMovieRequest,
													   @AuthenticationPrincipal UserDetails userDetails) {
		movieService.saveMovie(saveMovieRequest, userDetails);
		return ResponseEntity.status(HttpStatus.CREATED).body(new SaveMovieResponse("Film başarıyla kaydedildi."));
	}

	@PreAuthorize("hasAnyRole('USER','MODERATOR','ADMIN')")
	@PostMapping("/{movieId}/like")
	@RateLimit(maxRequests = 20)
	public ResponseEntity<VoteMovieResponse> voteLike(@PathVariable Long movieId,
													  @AuthenticationPrincipal UserDetails userDetails) {
		return movieService.voteMovie(movieId, userDetails, true);
	}

	@PreAuthorize("hasAnyRole('USER','MODERATOR','ADMIN')")
	@PostMapping("/{movieId}/dislike")
	@RateLimit(maxRequests = 20)
	public ResponseEntity<VoteMovieResponse> voteDislike(@PathVariable Long movieId,
														 @AuthenticationPrincipal UserDetails userDetails) {
		return movieService.voteMovie(movieId, userDetails, false);
	}

	@GetMapping("/getRecentlyAddedMovies")
	public Page<GetAllMoviesResponse> getAllMoviesSortedByDateDesc(@RequestParam(required = false) String genre,
																   @RequestParam(defaultValue = "0") int page,
																   @RequestParam(defaultValue = "15") int size,
																   @AuthenticationPrincipal UserDetails userDetails) {
		if (genre != null && !genre.trim().isEmpty()) {
			return movieService.getAllMoviesByGenreSortedByDateDesc(genre, page, size, userDetails);
		}

		return movieService.getAllMoviesSortedByDateDesc(page, size, userDetails);
	}

	@GetMapping("/getMostLikedMovies")
	public Page<GetMostLikedMoviesResponse> getMostLikedMovies(@RequestParam(required = false) String genre,
															   @RequestParam(defaultValue = "0") int page,
															   @RequestParam(defaultValue = "15") int size,
															   @AuthenticationPrincipal UserDetails userDetails) {
		if (genre != null && !genre.trim().isEmpty()) {
			return movieService.getMostLikedMoviesByGenreSortedByLike(genre, page, size, userDetails);
		}

		return movieService.getMostLikedMoviesSortedByLike(page, size, userDetails);
	}

	@GetMapping("/{id}")
	public ResponseEntity<GetMovieDataResponse> getMovieDataById(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
		return ResponseEntity.ok(movieService.getMovieById(id, userDetails));
	}

	@GetMapping("/search")
	@RateLimit(maxRequests = 20)
	public ResponseEntity<List<MovieSearchResponse>> search(@RequestParam String query) {
		return ResponseEntity.ok(movieService.searchMovies(query));
	}

	@GetMapping("/local-search")
	@RateLimit(maxRequests = 50)
	public ResponseEntity<List<MovieSearchResponse>> searchLocalMovies(@RequestParam String query) {
		return ResponseEntity.ok(movieService.searchLocalMovies(query));
	}
}