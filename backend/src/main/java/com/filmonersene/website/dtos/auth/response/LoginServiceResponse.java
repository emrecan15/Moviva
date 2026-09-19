package com.filmonersene.website.dtos.auth.response;

import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

public record LoginServiceResponse(
        String token,
        String username,
        Collection<? extends GrantedAuthority> roles
) {
}
