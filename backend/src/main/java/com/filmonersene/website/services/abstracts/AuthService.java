package com.filmonersene.website.services.abstracts;

import com.filmonersene.website.dtos.auth.response.AuthStatusResponse;
import com.filmonersene.website.dtos.auth.response.LoginServiceResponse;
import com.filmonersene.website.dtos.request.LoginRequest;
import com.filmonersene.website.dtos.request.ResetPasswordRequest;

public interface AuthService {
    LoginServiceResponse login(LoginRequest loginRequest);
    AuthStatusResponse getStatus(String jwt);
    void verifyUser(String token);
    void resetPasswordConfirm(ResetPasswordRequest request);
}
