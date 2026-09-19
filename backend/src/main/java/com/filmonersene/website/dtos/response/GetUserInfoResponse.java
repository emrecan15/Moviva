package com.filmonersene.website.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class GetUserInfoResponse {
	private String photoUrl;
	private String username;
	private String email;
	private String bio;
	private int recommendedMovieCount;
	private int commentCount;
	private int voteCount;
	LocalDateTime createdAt;
	
}
