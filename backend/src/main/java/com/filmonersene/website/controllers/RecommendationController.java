package com.filmonersene.website.controllers;


import com.filmonersene.website.annotation.RateLimit;
import com.filmonersene.website.dtos.recommendation.request.UpdateRecommendationRequest;
import com.filmonersene.website.dtos.recommendation.response.UpdateRecommendationResponse;
import com.filmonersene.website.dtos.request.CreateRecommendationRequest;
import com.filmonersene.website.services.abstracts.RecommendService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recommendations")
@PreAuthorize("hasAnyRole('USER','MODERATOR','ADMIN')")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendService recommendService;

    @PostMapping
    @RateLimit(maxRequests = 10)
    public ResponseEntity<String> recommend(
            @RequestBody @Valid CreateRecommendationRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(recommendService.recommend(request, userDetails));
    }

    @PutMapping("/{movieId}")
    @RateLimit(maxRequests = 10)
    public ResponseEntity<UpdateRecommendationResponse> updateRecommendation(@AuthenticationPrincipal UserDetails userDetails, @RequestBody @Valid UpdateRecommendationRequest updateRecommendationRequest, @PathVariable Long movieId){
        return ResponseEntity.ok(recommendService.updateRecommendation(userDetails,updateRecommendationRequest, movieId));
    }
}
