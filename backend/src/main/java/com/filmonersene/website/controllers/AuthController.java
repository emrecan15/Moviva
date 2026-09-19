package com.filmonersene.website.controllers;

import com.filmonersene.website.annotation.RateLimit;
import com.filmonersene.website.dtos.auth.response.AuthStatusResponse;
import com.filmonersene.website.dtos.auth.response.LoginServiceResponse;
import com.filmonersene.website.dtos.request.ForgotPasswordRequest;
import com.filmonersene.website.dtos.request.LoginRequest;
import com.filmonersene.website.dtos.request.ResetPasswordRequest;
import com.filmonersene.website.dtos.response.ForgotPasswordResponse;
import com.filmonersene.website.dtos.response.LoginResponse;
import com.filmonersene.website.exceptions.UserNotAuthenticatedException;
import com.filmonersene.website.security.JwtUtil;
import com.filmonersene.website.services.abstracts.AuthService;
import com.filmonersene.website.services.abstracts.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor

public class AuthController {

	private final JwtUtil jwtUtil;
	private final UserService userService;
	private final AuthService authService;

	@Value("${app.security.secure-cookie:false}")
	private boolean isSecureCookie;

	private void setTokenCookie(HttpServletResponse response, String token, long maxAge) {
		ResponseCookie cookie = ResponseCookie.from("token", token)
				.httpOnly(true)
				.secure(isSecureCookie)
				.path("/")
				.maxAge(maxAge)
				.sameSite("Lax")
				.build();
		response.setHeader(HttpHeaders.SET_COOKIE, cookie.toString());
	}

	@PostMapping("/login")
	@RateLimit(maxRequests = 10)
	public ResponseEntity<LoginResponse> login(
			@Valid @RequestBody LoginRequest loginRequest,
			HttpServletResponse response
	) {
		LoginServiceResponse serviceResponse = authService.login(loginRequest);

		setTokenCookie(
				response,
				serviceResponse.token(),
				7 * 24 * 60 * 60
		);

		return ResponseEntity.ok(
				new LoginResponse(
						serviceResponse.username(),
						serviceResponse.roles()
				)
		);
	}

	@PostMapping("/logout")
	public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth != null) {
			new SecurityContextLogoutHandler().logout(request, response, auth);
		}

		setTokenCookie(response, "", 0);

		return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
	}

	@GetMapping("/status")
	public ResponseEntity<AuthStatusResponse> getStatus(
			HttpServletRequest request
	) {
		String jwt = jwtUtil.parseJwt(request);

		if (jwt == null) {
			throw new UserNotAuthenticatedException("Token yok");
		}

		return ResponseEntity.ok(authService.getStatus(jwt));
	}

	@GetMapping("/verify")
	@RateLimit(maxRequests = 5)
	public ResponseEntity<String> verifyUser(@RequestParam String token) {
		authService.verifyUser(token);
		return ResponseEntity.ok("Hesabınız başarıyla doğrulandı.");
	}

	@PostMapping("/reset-password")
	@RateLimit(maxRequests = 5,timeWindowSeconds = 3600)
	public ResponseEntity<ForgotPasswordResponse> resetPassword(@RequestBody @Valid ForgotPasswordRequest request) {
		return ResponseEntity.ok(userService.forgotPassword(request.getEmail()));
	}


	@PostMapping("/reset-password/confirm")
	@RateLimit(maxRequests = 7, timeWindowSeconds = 300)
	public ResponseEntity<String> resetPasswordConfirm(@Valid @RequestBody ResetPasswordRequest request) {
		authService.resetPasswordConfirm(request);
		return ResponseEntity.ok("Şifre başarıyla değiştirildi");
	}
}