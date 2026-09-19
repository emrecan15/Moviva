package com.filmonersene.website.exceptions;

public class MovieListItemAlreadyExistsException extends RuntimeException {
    public MovieListItemAlreadyExistsException(String message) {
        super(message);
    }
}
