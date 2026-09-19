package com.filmonersene.website.services.concretes;

import com.filmonersene.website.dtos.request.GenreDTO;
import com.filmonersene.website.dtos.request.SaveMovieRequest;
import com.filmonersene.website.dtos.response.*;
import com.filmonersene.website.entities.*;
import com.filmonersene.website.exceptions.MovieAlreadyExistsException;
import com.filmonersene.website.exceptions.MovieNotFoundException;
import com.filmonersene.website.exceptions.UserNotFoundException;
import com.filmonersene.website.mapper.MovieMapper;
import com.filmonersene.website.repositories.*;
import com.filmonersene.website.services.abstracts.MovieService;
import com.filmonersene.website.services.abstracts.TmdbService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MovieManager implements MovieService {

	private final MovieRepository movieRepository;
	private final GenreRepository genreRepository;
	private final MovieLikeRepository movieLikeRepository;
	private final UserRepository userRepository;
	private final MovieViewRepository movieViewRepository;
	private final CommentRepository commentRepository;
	private final TmdbService tmdbService;
	private final MovieMapper movieMapper;

	@Override
	@Transactional
	public void saveMovie(SaveMovieRequest saveMovieRequest, UserDetails userDetails) {
		if (movieRepository.existsByImdbId(saveMovieRequest.getImdbId())) {
			throw new MovieAlreadyExistsException("Bu film daha önce eklenmiş.");
		}

		Movie movie = movieMapper.toEntity(saveMovieRequest);

		User user = userRepository.findByEmail(userDetails.getUsername())
				.orElseThrow(() -> new UserNotFoundException("Kullanıcı bulunamadı."));

		movie.setRecommendedBy(user);

		Set<Genre> genres = saveMovieRequest.getGenres().stream()
				.map(genreDTO -> genreRepository.findByTmdbId(genreDTO.getTmdbId())
						.orElseGet(() -> genreRepository.save(
								new Genre(null, genreDTO.getTmdbId(), genreDTO.getName())
						)))
				.collect(Collectors.toSet());

		movie.setGenres(genres);
		movieRepository.save(movie);
	}


	private UserVoteStatus getUserVoteStatus(Movie movie, UserDetails userDetails) {
		if (userDetails == null) {
			return new UserVoteStatus(false, false);
		}

		Optional<MovieLike> movieLikeOptional = userRepository.findByEmail(userDetails.getUsername())
				.flatMap(user -> movieLikeRepository.findByUserAndMovie(user, movie));

		boolean liked = movieLikeOptional.map(MovieLike::isLiked).orElse(false);
		boolean disliked = movieLikeOptional.map(like -> !like.isLiked()).orElse(false);

		return new UserVoteStatus(liked, disliked);
	}

	private String formatVoteAverage(Double voteAverage) {
		if (voteAverage == null) {
			return null;
		}

		voteAverage = Math.round(voteAverage * 10) / 10.0;
		return String.format("%.1f", voteAverage);
	}

	private GetAllMoviesResponse convertToDtoGetAllMovies(Movie movie, UserDetails userDetails) {
		Set<GenreDTO> genres = movieMapper.toGenreDTOSet(movie.getGenres());
		String voteAverage = formatVoteAverage(movie.getVoteAverage());

		long likeCount = movieLikeRepository.countByMovieAndLiked(movie, true);
		long dislikeCount = movieLikeRepository.countByMovieAndLiked(movie, false);
		UserVoteStatus voteStatus = getUserVoteStatus(movie, userDetails);
		long commentCount = commentRepository.countByMovieId(movie.getId());

		RecommendedByDto recommendedBy = movieMapper.toRecommendedByDto(movie.getRecommendedBy());

		String recommenderComment = null;

		if (recommendedBy != null) {
			recommenderComment = movieRepository.findUserCommentByUserIdAndMovieId(
					recommendedBy.getUserId(), movie.getId()
			);
		}

		Integer year = movie.getReleaseDate() != null && movie.getReleaseDate().length() >= 4
				? Integer.valueOf(movie.getReleaseDate().substring(0, 4))
				: null;

		return new GetAllMoviesResponse(
				movie.getId(),
				movie.getPosterUrl(),
				movie.getBackdropUrl(),
				movie.getMovieName(),
				year,
				voteAverage,
				genres,
				recommendedBy,
				recommenderComment,
				(int) likeCount,
				(int) dislikeCount,
				voteStatus.liked(),
				voteStatus.disliked(),
				movieViewRepository.countByMovieId(movie.getId()),
				commentCount
		);
	}

	private GetMostLikedMoviesResponse convertToDtoGetMostLikedMovies(Movie movie, UserDetails userDetails) {
		Set<GenreDTO> genres = movie.getGenres().stream()
				.map(genre -> new GenreDTO(genre.getTmdbId(), genre.getName()))
				.collect(Collectors.toSet());

		RecommendedByDto recommendedBy = null;

		if (movie.getRecommendedBy() != null) {
			recommendedBy = new RecommendedByDto(
					movie.getRecommendedBy().getId(),
					movie.getRecommendedBy().getUsername(),
					movie.getRecommendedBy().getTag() != null
							? movie.getRecommendedBy().getTag().getName()
							: null
			);
		}

		Double voteAverage = movie.getVoteAverage();

		if (voteAverage != null) {
			voteAverage = Math.round(voteAverage * 10) / 10.0;
		}

		long likeCount = movieLikeRepository.countByMovieAndLiked(movie, true);
		long dislikeCount = movieLikeRepository.countByMovieAndLiked(movie, false);
		UserVoteStatus voteStatus = getUserVoteStatus(movie, userDetails);
		long commentCount = commentRepository.countByMovieId(movie.getId());

		String recommenderComment = null;

		if (recommendedBy != null) {
			recommenderComment = movieRepository.findUserCommentByUserIdAndMovieId(
					recommendedBy.getUserId(), movie.getId()
			);
		}

		Integer year = movie.getReleaseDate() != null && movie.getReleaseDate().length() >= 4
				? Integer.valueOf(movie.getReleaseDate().substring(0, 4))
				: null;

		return new GetMostLikedMoviesResponse(
				movie.getId(),
				movie.getPosterUrl(),
				movie.getMovieName(),
				year,
				voteAverage,
				genres,
				recommendedBy,
				recommenderComment,
				(int) likeCount,
				(int) dislikeCount,
				voteStatus.liked(),
				voteStatus.disliked(),
				movieViewRepository.countByMovieId(movie.getId()),
				commentCount
		);
	}

	@Override
	@Transactional
	public ResponseEntity<VoteMovieResponse> voteMovie(Long movieId, UserDetails userDetails, boolean isLike) {
		Movie movie = movieRepository.findById(movieId)
				.orElseThrow(() -> new RuntimeException("Film bulunamadı."));

		return handleUserVote(userDetails, movie, isLike);
	}

	private ResponseEntity<VoteMovieResponse> handleUserVote(UserDetails userDetails, Movie movie, boolean isLike) {
		User user = userRepository.findByEmail(userDetails.getUsername())
				.orElseThrow(() -> new UserNotFoundException("Kullanıcı bulunamadı."));

		Optional<MovieLike> existingOpt = movieLikeRepository.findByUserAndMovie(user, movie);

		if (existingOpt.isPresent()) {
			MovieLike existing = existingOpt.get();

			if (existing.isLiked() == isLike) {
				movieLikeRepository.delete(existing);

				if (isLike) {
					decrementMovieOwnerScore(movie);
				}
			} else {
				if (existing.isLiked() && !isLike) {
					decrementMovieOwnerScore(movie);
				}

				if (!existing.isLiked() && isLike) {
					incrementMovieOwnerScore(movie);
				}

				existing.setLiked(isLike);
				movieLikeRepository.save(existing);
			}
		} else {
			MovieLike like = new MovieLike();
			like.setUser(user);
			like.setMovie(movie);
			like.setLiked(isLike);

			movieLikeRepository.save(like);

			if (isLike) {
				incrementMovieOwnerScore(movie);
			}
		}

		long likeCount = movieLikeRepository.countByMovieAndLiked(movie, true);
		long dislikeCount = movieLikeRepository.countByMovieAndLiked(movie, false);

		Optional<MovieLike> currentVote = movieLikeRepository.findByUserAndMovie(user, movie);

		boolean liked = currentVote.map(MovieLike::isLiked).orElse(false);
		boolean disliked = currentVote.map(vote -> !vote.isLiked()).orElse(false);

		VoteMovieResponse response = new VoteMovieResponse(
				likeCount,
				dislikeCount,
				liked,
				disliked
		);

		return ResponseEntity.ok(response);
	}

	private void incrementMovieOwnerScore(Movie movie) {
		User user = movie.getRecommendedBy();

		if (user == null) {
			return;
		}

		user.setPoints(user.getPoints() + 1);
		userRepository.save(user);
	}

	private void decrementMovieOwnerScore(Movie movie) {
		User user = movie.getRecommendedBy();

		if (user == null) {
			return;
		}

		user.setPoints(Math.max(user.getPoints() - 1, 0));
		userRepository.save(user);
	}

	@Override
	public Page<GetAllMoviesResponse> getAllMoviesSortedByDateDesc(int page, int size, UserDetails userDetails) {
		Pageable pageable = PageRequest.of(
				page,
				size,
				Sort.by(Sort.Direction.DESC, "createdAt")
		);

		Page<Movie> moviePage = movieRepository.findAll(pageable);

		return moviePage.map(movie -> convertToDtoGetAllMovies(movie, userDetails));
	}

	@Override
	public Page<GetAllMoviesResponse> getAllMoviesByGenreSortedByDateDesc(
			String genre, int page, int size, UserDetails userDetails) {

		Pageable pageable = PageRequest.of(
				page,
				size,
				Sort.by(Sort.Direction.DESC, "createdAt")
		);

		Page<Movie> moviePage = movieRepository.findByGenres_Name(genre, pageable);

		return moviePage.map(movie -> convertToDtoGetAllMovies(movie, userDetails));
	}

	@Override
	public GetMovieDataResponse getMovieById(Long id, UserDetails userDetails) {
		Movie movie = movieRepository.findById(id)
				.orElseThrow(() -> new MovieNotFoundException("Movie not found."));

		Set<GenreDTO> genres = movieMapper.toGenreDTOSet(movie.getGenres());
		RecommendedByDto recommendedBy = movieMapper.toRecommendedByDto(movie.getRecommendedBy());

		String recommenderComment = null;

		if (recommendedBy != null) {
			recommenderComment = movieRepository.findUserCommentByUserIdAndMovieId(
					recommendedBy.getUserId(), movie.getId()
			);
		}

		String formattedVoteAverage = formatVoteAverage(movie.getVoteAverage());
		long likeCount = movieLikeRepository.countByMovieAndLiked(movie, true);
		long dislikeCount = movieLikeRepository.countByMovieAndLiked(movie, false);
		UserVoteStatus voteStatus = getUserVoteStatus(movie, userDetails);

		String year = movie.getReleaseDate() != null && movie.getReleaseDate().length() >= 4
				? movie.getReleaseDate().substring(0, 4)
				: null;

		recordMovieView(movie.getId(), userDetails);

		String currentUsername = userDetails != null ? userDetails.getUsername() : null;

		List<GetCommentResponse> comments = movie.getComments().stream()
				.map(comment -> {
					boolean owner = currentUsername != null
							&& currentUsername.equals(comment.getUser().getUsername());

					return new GetCommentResponse(
							comment.getId(),
							comment.getUser().getUsername(),
							comment.getText(),
							comment.isContainsSpoiler(),
							owner
					);
				})
				.toList();

		return new GetMovieDataResponse(
				movie.getId(),
				movie.getPosterUrl(),
				movie.getBackdropUrl(),
				movie.getMovieName(),
				movie.getOriginalTitle(),
				movie.getDirector(),
				year,
				movie.getCountry(),
				formattedVoteAverage,
				genres,
				recommendedBy,
				likeCount,
				dislikeCount,
				voteStatus.liked(),
				voteStatus.disliked(),
				movie.getImdbId(),
				movie.getDescription(),
				recommenderComment,
				movie.getTagline(),
				comments
		);
	}

	private void recordMovieView(Long movieId, UserDetails userDetails) {
		if (userDetails == null) {
			return;
		}

		LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1);

		userRepository.findByEmail(userDetails.getUsername()).ifPresent(user -> {
			boolean viewed = movieViewRepository.existsByMovieIdAndUserIdAndViewedAtAfter(
					movieId, user.getId(), oneHourAgo
			);

			if (!viewed) {
				movieViewRepository.save(
						new MovieView(movieId, user.getId(), LocalDateTime.now())
				);
			}
		});
	}

	@Override
	public Page<GetMostLikedMoviesResponse> getMostLikedMoviesSortedByLike(
			int page, int size, UserDetails userDetails) {

		Pageable pageable = PageRequest.of(page, size);
		Page<Movie> moviePage = movieRepository.findMostLikedMoviesNative(pageable);

		return moviePage.map(movie -> convertToDtoGetMostLikedMovies(movie, userDetails));
	}

	@Override
	public Page<GetMostLikedMoviesResponse> getMostLikedMoviesByGenreSortedByLike(
			String genre, int page, int size, UserDetails userDetails) {

		Pageable pageable = PageRequest.of(page, size);
		Page<Movie> moviePage = movieRepository.findMostLikedMoviesByGenre(genre, pageable);

		return moviePage.map(movie -> convertToDtoGetMostLikedMovies(movie, userDetails));
	}

	@Override
	public List<MovieSearchResponse> searchMovies(String query) {
		List<TmdbMovieResponse> tmdbMovies = tmdbService.searchMovies(query);

		return tmdbMovies.stream()
				.map(movie -> new MovieSearchResponse(
						null,
						movie.id(),
						movie.title(),
						movie.originalTitle(),
						movie.posterPath(),
						movie.backdropPath(),
						movie.overview(),
						movie.releaseDate(),
						movie.voteAverage(),
						!movieRepository.existsByTmdbId(movie.id())
				))
				.collect(Collectors.toList());
	}

	@Override
	public List<MovieSearchResponse> searchLocalMovies(String query) {
		List<Movie> localMovies = movieRepository.findTop20ByMovieNameContainingIgnoreCase(query);

		return localMovies.stream().map(movieMapper::toMovieSearchResponse).collect(Collectors.toList());
	}


	private record UserVoteStatus(boolean liked, boolean disliked) {
	}
}

