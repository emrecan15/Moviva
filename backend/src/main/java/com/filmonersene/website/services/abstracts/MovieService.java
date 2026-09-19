package com.filmonersene.website.services.abstracts;

import java.util.List;

import com.filmonersene.website.dtos.response.*;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;

import com.filmonersene.website.dtos.request.SaveMovieRequest;

public interface MovieService {

	void saveMovie(
			SaveMovieRequest saveMovieRequest,
			UserDetails userDetails
	);



	ResponseEntity<VoteMovieResponse> voteMovie(
			Long movieId,
			UserDetails userDetails,
			boolean isLike
	);

	Page<GetAllMoviesResponse> getAllMoviesSortedByDateDesc(
			int page,
			int size,
			UserDetails userDetails
	);

	Page<GetAllMoviesResponse> getAllMoviesByGenreSortedByDateDesc(
			String genre,
			int page,
			int size,
			UserDetails userDetails
	);

	GetMovieDataResponse getMovieById(
			Long id,
			UserDetails userDetails
	);

	Page<GetMostLikedMoviesResponse> getMostLikedMoviesSortedByLike(
			int page,
			int size,
			UserDetails userDetails
	);

	Page<GetMostLikedMoviesResponse> getMostLikedMoviesByGenreSortedByLike(
			String genre,
			int page,
			int size,
			UserDetails userDetails
	);

	List<MovieSearchResponse> searchMovies(String query);

	List<MovieSearchResponse> searchLocalMovies(String query);
}
