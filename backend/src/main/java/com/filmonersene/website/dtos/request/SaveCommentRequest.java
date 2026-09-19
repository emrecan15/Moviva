package com.filmonersene.website.dtos.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SaveCommentRequest {
	
	private Long movieId;

	@NotBlank(message = "Yorum boş bırakılamaz.")
	@Size(min = 2, max = 500, message = "Yorum 2 ile 500 karakter arasında olmalıdır.")
	private String comment;
	private boolean containsSpoiler;

}
