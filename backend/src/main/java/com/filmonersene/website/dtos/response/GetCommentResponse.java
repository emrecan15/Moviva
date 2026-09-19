package com.filmonersene.website.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class GetCommentResponse {

	private Long id;
	private String username;
	private String comment;
	private boolean containsSpoiler;
	private boolean owner;
	
}
