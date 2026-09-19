package com.filmonersene.website.exceptions;

public class UserNotFoundException extends RuntimeException{
	
	public UserNotFoundException(String message)
	{
		super(message);
	}
}
