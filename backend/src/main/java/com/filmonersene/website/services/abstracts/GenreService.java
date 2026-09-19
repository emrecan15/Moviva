package com.filmonersene.website.services.abstracts;

import java.util.List;

import com.filmonersene.website.dtos.response.GenreStatResponse;

public interface GenreService {
	List<GenreStatResponse> getGenreStat();
}
