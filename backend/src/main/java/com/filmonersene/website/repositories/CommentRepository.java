package com.filmonersene.website.repositories;

import com.filmonersene.website.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;


import com.filmonersene.website.entities.Comment;
import com.filmonersene.website.entities.Movie;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long>{
	
	Page<Comment> findByMovieId(Long movieId, Pageable pageable);
	Page<Comment> findByMovieIdOrderByCreatedAtDesc(Long movieId, Pageable pageable);
	long countByMovieId(Long movieId);

	int countByUser_Id(Long userId);



}
