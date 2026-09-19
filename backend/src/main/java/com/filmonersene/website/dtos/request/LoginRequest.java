package com.filmonersene.website.dtos.request;


import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest {
	
	@NotBlank(message = "E-posta zorunludur.")
	@Email(message = "Geçerli bir e-posta adresi girin.")
	@Size(max = 254, message = "E-posta en fazla 254 karakter olabilir.")
	private String email;

	@NotBlank(message = "Şifre zorunludur.")
	@Size(max = 100, message = "Şifre en fazla 100 karakter olabilir.")
	private String password;
}
