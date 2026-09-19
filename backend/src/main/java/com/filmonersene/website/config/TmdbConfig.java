package com.filmonersene.website.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class TmdbConfig {
    @Bean
    public RestClient tmdbClient(
            @Value("${tmdb.base-url}") String baseUrl

    ) {
        return RestClient.builder()
                .baseUrl(baseUrl)
                .build();
    }
}
