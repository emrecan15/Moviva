package com.filmonersene.website.repositories;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.filmonersene.website.entities.MovieView;

@Repository
public interface MovieViewRepository extends JpaRepository<MovieView, Long> {

	Optional<MovieView> findByMovieId(Long movieId);

	Optional<MovieView> findByMovieIdAndUserId(
			Long movieId,
			Long userId
	);

	long countByMovieId(Long movieId);


	boolean existsByMovieIdAndUserIdAndViewedAtAfter(
			Long movieId,
			Long userId,
			LocalDateTime afterTime
	);
}