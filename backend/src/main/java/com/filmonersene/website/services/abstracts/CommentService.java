package com.filmonersene.website.services.abstracts;

import com.filmonersene.website.dtos.comment.request.UpdateCommentRequest;
import com.filmonersene.website.dtos.comment.response.UpdateCommentResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;

import com.filmonersene.website.dtos.request.SaveCommentRequest;
import com.filmonersene.website.dtos.response.GetCommentResponse;
import com.filmonersene.website.dtos.response.SaveCommentResponse;

public interface CommentService {
	
	Page<GetCommentResponse> getCommentsByMovieId(Long movieId,Pageable pageable);
	SaveCommentResponse saveComment(UserDetails userDetails,SaveCommentRequest saveCommentRequest);
	UpdateCommentResponse updateComment(Long commentId,UserDetails userDetails, UpdateCommentRequest updateCommentRequest);
	void deleteComment(UserDetails userDetails,Long commentId);


	
}
