package com.filmonersene.website.config;

import java.util.List;

import com.filmonersene.website.security.GlobalRateLimitFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.filmonersene.website.security.JwtAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {
	
	private final JwtAuthenticationFilter jwtAuthenticationFilter;
	private final GlobalRateLimitFilter globalRateLimitFilter;

	@Value("${app.frontend-url}")
	private String frontendUrl;

	@Value("${app.base-url}")
	private String backendUrl;
/*
    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

 */
    
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
            		.requestMatchers("/film-detay").permitAll()
            		.requestMatchers(
            				"/", 
            	            "/anasayfa", 
            	            "/tum-filmler",
            	            "/en-cok-begenilenler",
            	            "/profil", 
            	            "/film-oner",
            	            "/css/**", 
            	            "/js/**", 
            	            "/images/**",
            	            "/favicon.ico",
            	            "/assets/**",
            	            "/favicon-16x16.png",
                            "/favicon-32x32.png",
                            "/sitemap.xml",
                            "/robots.txt",
                            "/navbar.html",
                            "/error/**",
                            "/hakkimizda",
                            "/reset-password"
            	        ).permitAll()
            		.requestMatchers(
            	            "/api/auth/login", 
            	            "/api/auth/logout",
            	            "/api/auth/status", 
            	            "/api/user/register",
            	            "/api/movies/recent",
							"/api/movies/*",
            	            "/api/movies/*/like",
            	            "/api/movies/*/dislike",
            	            "/api/movies/getRecentlyAddedMovies",
            	            "/api/movies/getMostLiked7Movies",
            	            "/api/movies/getMostLikedMovies",
            	            "/api/movies",
            	            "/api/auth/verify",
            	            "/api/comments/",
            	            "/api/auth/reset-password",
            	            "/api/auth/reset-password/confirm",
            	            "/api/genre-stats",
							"/api/lists/**",
							"/v3/api-docs/**",
							"/swagger-ui/**",
							"/swagger-ui.html"
            	        ).permitAll()
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
			.addFilterAfter(globalRateLimitFilter, JwtAuthenticationFilter.class);
        return http.build();
    }

    
    
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(frontendUrl,backendUrl));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
	
	

}
