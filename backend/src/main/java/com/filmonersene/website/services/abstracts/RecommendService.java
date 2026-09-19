package com.filmonersene.website.services.abstracts;

import com.filmonersene.website.dtos.recommendation.request.UpdateRecommendationRequest;
import com.filmonersene.website.dtos.recommendation.response.UpdateRecommendationResponse;
import com.filmonersene.website.dtos.request.CreateRecommendationRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;

public interface RecommendService {
    String recommend(CreateRecommendationRequest request, UserDetails userDetails);

    UpdateRecommendationResponse updateRecommendation(UserDetails userDetails, UpdateRecommendationRequest updateRecommendationRequest, Long movieId);
}
