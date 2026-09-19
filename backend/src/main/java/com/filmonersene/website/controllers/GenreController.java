package com.filmonersene.website.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.filmonersene.website.dtos.response.GenreStatResponse;
import com.filmonersene.website.services.abstracts.GenreService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class GenreController {
	private final GenreService genreService;
	
	@GetMapping("/genre-stats")
	public ResponseEntity<List<GenreStatResponse>> getGenreStats(){
		return ResponseEntity.ok(genreService.getGenreStat());
	}

}
