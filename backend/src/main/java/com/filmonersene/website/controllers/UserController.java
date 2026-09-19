package com.filmonersene.website.controllers;

import com.filmonersene.website.annotation.RateLimit;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.filmonersene.website.dtos.request.ChangePasswordRequest;
import com.filmonersene.website.dtos.request.CreateUserRequest;
import com.filmonersene.website.dtos.request.UpdateUserRequest;
import com.filmonersene.website.dtos.response.ChangePasswordResponse;
import com.filmonersene.website.dtos.response.CreateUserResponse;
import com.filmonersene.website.dtos.response.GetUserInfoResponse;
import com.filmonersene.website.dtos.response.UpdateUserResponse;
import com.filmonersene.website.services.abstracts.UserService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

	private final UserService userService;
	
	@PostMapping("/register")
	@RateLimit(maxRequests = 5, timeWindowSeconds = 300)
	public ResponseEntity<CreateUserResponse> createUser(@RequestBody @Valid CreateUserRequest createUserRequest)
	{
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(userService.createUser(createUserRequest));
	}
	
	@PreAuthorize("hasAnyRole('USER','MODERATOR','ADMIN')")
	@GetMapping("/userinfo")
	public ResponseEntity<GetUserInfoResponse> getUserInfo(@AuthenticationPrincipal UserDetails userDetails){

		return ResponseEntity.ok(userService.getUserInfo(userDetails));
	}
	
	@PreAuthorize("hasAnyRole('USER','MODERATOR','ADMIN')")
	@PutMapping("/update")
	@RateLimit(maxRequests = 10)
	public ResponseEntity<UpdateUserResponse> updateUser(@AuthenticationPrincipal UserDetails userDetails ,@RequestBody @Valid UpdateUserRequest userRequest){

		return ResponseEntity.ok(userService.updateUser(userDetails,userRequest));
	}
	
	@PreAuthorize("hasAnyRole('USER','MODERATOR','ADMIN')")
	@PostMapping("/change-password")
	public ResponseEntity<ChangePasswordResponse> changePassword(@AuthenticationPrincipal UserDetails userDetails, @RequestBody @Valid ChangePasswordRequest changePasswordRequest)
	{
		return ResponseEntity.ok(userService.changePassword(userDetails, changePasswordRequest));
	}
	
	
	
	
	
	
}
