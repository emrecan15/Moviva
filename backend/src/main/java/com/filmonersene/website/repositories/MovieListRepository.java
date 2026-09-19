package com.filmonersene.website.repositories;

import com.filmonersene.website.entities.MovieList;
import com.filmonersene.website.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;



@Repository
public interface MovieListRepository extends JpaRepository<MovieList,Long>{
    Page<MovieList> findByUser(User user, Pageable pageable);

}
