package com.filmonersene.website.services.concretes;

import com.filmonersene.website.dtos.auth.response.AuthStatusResponse;
import com.filmonersene.website.dtos.auth.response.LoginServiceResponse;
import com.filmonersene.website.dtos.request.LoginRequest;
import com.filmonersene.website.dtos.request.ResetPasswordRequest;
import com.filmonersene.website.entities.User;
import com.filmonersene.website.entities.VerificationToken;
import com.filmonersene.website.exceptions.InvalidParameterException;
import com.filmonersene.website.exceptions.ResourceNotFoundException;
import com.filmonersene.website.exceptions.UserNotFoundException;
import com.filmonersene.website.repositories.UserRepository;
import com.filmonersene.website.repositories.VerificationTokenRepository;
import com.filmonersene.website.security.JwtUtil;
import com.filmonersene.website.services.abstracts.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthManager implements AuthService {

    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final VerificationTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;


    @Override
    public LoginServiceResponse login(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Geçersiz kullanıcı adı veya parola."));

        if (!user.isEnabled()) {
            throw new DisabledException("Hesabınız aktif değil. Lütfen e-posta doğrulaması yapınız.");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        String token = jwtUtil.generateToken(userDetails.getUsername());

        return new LoginServiceResponse(
                token,
                userDetails.getUsername(),
                userDetails.getAuthorities()
        );
    }

    @Override
    public AuthStatusResponse getStatus(String jwt) {
        String email = jwtUtil.extractEmail(jwt);

        if (!jwtUtil.isTokenValid(jwt, email)) {
            throw new BadCredentialsException("Token geçersiz");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("Kullanıcı bulunamadı"));

        return new AuthStatusResponse(
                true,
                user.getEmail(),
                user.getUsername(),
                user.getRole().getName()
        );
    }

    @Override
    public void verifyUser(String token) {
        VerificationToken vToken = tokenRepository.findByToken(token)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Geçersiz doğrulama linki."));

        if (vToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new InvalidParameterException("Token süresi dolmuş.");
        }

        User user = vToken.getUser();
        user.setEnabled(true);

        userRepository.save(user);
        tokenRepository.delete(vToken);
    }


    @Override
    public void resetPasswordConfirm(ResetPasswordRequest request) {

        VerificationToken vToken = tokenRepository.findByToken(request.getToken())
                .orElseThrow(() ->
                        new InvalidParameterException("Token geçersiz veya süresi dolmuş"));

        if (vToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new InvalidParameterException("Token geçersiz veya süresi dolmuş");
        }

        User user = vToken.getUser();

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        tokenRepository.delete(vToken);
    }
}
