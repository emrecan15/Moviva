package com.filmonersene.website.exceptions;

public class UserAlreadyExistsException extends IllegalStateException {
	
	public UserAlreadyExistsException(String message)
	{
		super(message);
	}
}
