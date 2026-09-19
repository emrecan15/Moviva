package com.filmonersene.website.exceptions;

public class UserNotAuthenticatedException extends RuntimeException{
	
	public UserNotAuthenticatedException(String message)
	{
		super(message);
	}
}
