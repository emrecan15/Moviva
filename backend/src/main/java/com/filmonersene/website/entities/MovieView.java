package com.filmonersene.website.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class MovieView {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private Long movieId;

	private Long userId;

	private LocalDateTime viewedAt;

	public MovieView(Long movieId, Long userId, LocalDateTime viewedAt) {
		this.movieId = movieId;
		this.userId = userId;
		this.viewedAt = viewedAt;
	}
}