package com.filmonersene.website.dtos.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UpdateUserRequest {

	@NotBlank(message = "Kullanıcı adı boş bırakılamaz.")
	@Size(min = 3, max = 15, message = "Kullanıcı adı en az 3, en fazla 15 karakter uzunluğunda olabilir.")
	@Pattern(
			regexp = "^[A-Za-zÇĞİÖŞÜçğıöşü0-9_.]+$",
			message = "Kullanıcı adı sadece harf, rakam, nokta ve alt çizgi içerebilir."
	)
	private String username;

	@Size(max = 255, message = "Hakkında kısmı en fazla 255 karakter olabilir.")
	private String bio;
}