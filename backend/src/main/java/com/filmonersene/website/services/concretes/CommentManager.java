package com.filmonersene.website.services.concretes;



import com.filmonersene.website.dtos.comment.request.UpdateCommentRequest;
import com.filmonersene.website.dtos.comment.response.UpdateCommentResponse;
import com.filmonersene.website.exceptions.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.filmonersene.website.dtos.request.SaveCommentRequest;
import com.filmonersene.website.dtos.response.GetCommentResponse;
import com.filmonersene.website.dtos.response.SaveCommentResponse;
import com.filmonersene.website.entities.Comment;
import com.filmonersene.website.entities.Movie;
import com.filmonersene.website.entities.User;
import com.filmonersene.website.repositories.CommentRepository;
import com.filmonersene.website.repositories.MovieRepository;
import com.filmonersene.website.repositories.UserRepository;
import com.filmonersene.website.services.abstracts.CommentService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommentManager implements CommentService {
	
	private final CommentRepository commentRepository;
	private final UserRepository userRepository;
	private final MovieRepository movieRepository;

	@Override
	public Page<GetCommentResponse> getCommentsByMovieId(Long movieId, Pageable pageable) {
		String email= getCurrentUserEmail();
		
		Page<Comment> comments = commentRepository.findByMovieIdOrderByCreatedAtDesc(movieId, pageable);
		
		
		return comments.map(comment -> {
	        GetCommentResponse dto = new GetCommentResponse();
			dto.setId(comment.getId());
	        dto.setUsername(comment.getUser().getUsername());
	        dto.setComment(comment.getText());
	        dto.setContainsSpoiler(comment.isContainsSpoiler());
	        dto.setOwner(email != null && email.equals(comment.getUser().getEmail()));
	        return dto;
	    });
	}
	
	public String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UserNotAuthenticatedException("Kullanıcı doğrulanmamış!");
        }
        return authentication.getName();
    }

	@Override
	@Transactional
	public SaveCommentResponse saveComment(UserDetails userDetails, SaveCommentRequest saveCommentRequest) {
		String email = userDetails.getUsername();
		User user = userRepository.findByEmail(email)
				.orElseThrow(() ->  new UsernameNotFoundException("Kullanıcı bulunamadı :"+email));
		
		Movie movie = movieRepository.findById(saveCommentRequest.getMovieId())
				.orElseThrow(() -> new MovieNotFoundException("Film bulunamadı : ID  "+saveCommentRequest.getMovieId())); 
		
		Comment comment = new Comment();
		comment.setContainsSpoiler(saveCommentRequest.isContainsSpoiler());
		comment.setText(saveCommentRequest.getComment());
		comment.setUser(user);
		comment.setMovie(movie);
		
		commentRepository.save(comment);

		return new SaveCommentResponse("Yorumunuz başarıyla gönderildi.");
	}

	@Override
	@Transactional
	public UpdateCommentResponse updateComment(Long commentId, UserDetails userDetails, UpdateCommentRequest updateCommentRequest) {
		User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new UserNotFoundException("Kullanıcı bulunamadı."));
		Comment comment = commentRepository.findById(commentId).orElseThrow(() -> new CommentNotFoundException("Yorum bulunamadı."));

		if (!user.getId().equals(comment.getUser().getId()))
		{
			throw new ResourceAccessDeniedException("Bu yorumu değiştirme yetkiniz yok.");
		}

		comment.setText(updateCommentRequest.comment());

		commentRepository.save(comment);

		return new UpdateCommentResponse(comment.getId(),comment.getText());
	}

	@Override
	@Transactional
	public void deleteComment(UserDetails userDetails, Long commentId) {
		User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new UserNotFoundException("Kullanıcı bulunamadı."));
		Comment comment = commentRepository.findById(commentId).orElseThrow(() -> new CommentNotFoundException("Yorum bulunamadı."));

		if(!user.getId().equals(comment.getUser().getId()))
		{
			throw new ResourceAccessDeniedException("Bu yorumu silme yetkiniz yok.");
		}
		commentRepository.delete(comment);
	}


}
