package com.filmonersene.website.controllers;


import com.filmonersene.website.annotation.RateLimit;
import com.filmonersene.website.dtos.comment.request.UpdateCommentRequest;
import com.filmonersene.website.dtos.comment.response.UpdateCommentResponse;
import com.filmonersene.website.dtos.request.SaveCommentRequest;
import com.filmonersene.website.dtos.response.GetCommentResponse;
import com.filmonersene.website.dtos.response.SaveCommentResponse;
import com.filmonersene.website.services.abstracts.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

	private final CommentService commentService;

	@GetMapping("/")
	public ResponseEntity<Page<GetCommentResponse>> getCommentsByMovieId(@RequestParam Long movieId, Pageable pageable)
	{
		return ResponseEntity.ok(commentService.getCommentsByMovieId(movieId, pageable));
	}

	@PreAuthorize("hasAnyRole('USER','MODERATOR','ADMIN')")
	@PostMapping("/")
	@RateLimit(maxRequests = 5)
	public ResponseEntity<SaveCommentResponse> saveComment(@AuthenticationPrincipal UserDetails userDetails, @RequestBody @Valid SaveCommentRequest saveCommentRequest){
		return ResponseEntity.ok(commentService.saveComment(userDetails, saveCommentRequest));
	}

	@PreAuthorize("hasAnyRole('USER','MODERATOR','ADMIN')")
	@PutMapping("/{commentId}")
	@RateLimit(maxRequests = 10)
	public ResponseEntity<UpdateCommentResponse> updateComment(@PathVariable Long commentId, @AuthenticationPrincipal UserDetails userDetails, @RequestBody @Valid UpdateCommentRequest updateCommentRequest){
		return ResponseEntity.ok(commentService.updateComment(commentId,userDetails, updateCommentRequest));
	}

	@PreAuthorize("hasAnyRole('USER','MODERATOR','ADMIN')")
	@DeleteMapping("/{commentId}")
	@RateLimit(maxRequests = 10)
	public ResponseEntity<Void> deleteComment(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long commentId){
		commentService.deleteComment(userDetails,commentId);
		return ResponseEntity.noContent().build();
	}

}
