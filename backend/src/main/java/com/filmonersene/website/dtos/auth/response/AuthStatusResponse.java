package com.filmonersene.website.dtos.auth.response;

public record AuthStatusResponse(boolean authenticated,
                                 String email,
                                 String username,
                                 String role) {
}
