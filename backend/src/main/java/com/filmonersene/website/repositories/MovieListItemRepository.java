package com.filmonersene.website.repositories;

import com.filmonersene.website.entities.MovieListItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieListItemRepository extends JpaRepository<MovieListItem,Long> {

    Page<MovieListItem> findByMovieListId(Long listId, Pageable pageable);

    boolean existsByMovieList_IdAndMovie_Id(Long listId,Long movieId);
    long deleteByMovieList_IdAndMovie_Id(Long listId,Long movieId);


    int countByMovieListId(Long movieListId);

    @Query("SELECT AVG(m.voteAverage) FROM MovieListItem item JOIN item.movie m WHERE item.movieList.id = :listId")
    Double getAverageRatingByListId(@Param("listId") Long listId);

    @Query("SELECT m.runtime FROM MovieListItem item JOIN item.movie m WHERE item.movieList.id = :listId")
    List<String> findRuntimesByListId(@Param("listId") Long listId);

}
