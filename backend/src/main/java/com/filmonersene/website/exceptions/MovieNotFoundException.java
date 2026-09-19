package com.filmonersene.website.exceptions;

public class MovieNotFoundException extends RuntimeException {
	
	public MovieNotFoundException(String message)
	{
		super(message);
	}
}
