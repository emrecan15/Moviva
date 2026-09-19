package com.filmonersene.website.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;


import com.filmonersene.website.entities.Genre;

@Repository
public interface GenreRepository extends JpaRepository<Genre, Long>{
	
	Optional<Genre> findByTmdbId(Integer tmdbId);
	
	
	
	@Query(value = """
		    SELECT g.id AS genre_id, g.name AS genre_name, COUNT(mg.movie_id) AS film_sayisi
		    FROM movie_genres mg
		    JOIN genres g ON g.id = mg.genre_id
		    GROUP BY g.id, g.name
		    ORDER BY g.name
		""", nativeQuery = true)
		List<Object[]> getGenreStatsRaw();

}
