package com.filmonersene.website.services.concretes;

import java.util.List;

import org.springframework.stereotype.Service;

import com.filmonersene.website.dtos.response.GenreStatResponse;
import com.filmonersene.website.repositories.GenreRepository;
import com.filmonersene.website.services.abstracts.GenreService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GenreManager implements GenreService{
	
	private final GenreRepository genreRepository;

	@Override
	public List<GenreStatResponse> getGenreStat() {
		List<Object[]> raw = genreRepository.getGenreStatsRaw();
	    return raw.stream()
	        .map(row -> new GenreStatResponse(
					((Number) row[0]).longValue(),
					(String) row[1],
	            ((Number) row[2]).longValue())
	        )
	        .toList();
	}

}
