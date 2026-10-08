package com.cineverse.controller;

import com.cineverse.dto.ApiResponse;
import com.cineverse.dto.RecommendationDto;
import com.cineverse.security.UserPrincipal;
import com.cineverse.service.RecommendationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
@Tag(name = "Recommendations", description = "Smart next-watch and related story suggestions")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @GetMapping("/recommendations")
    @Operation(summary = "Get smart next-watch recommendations based on user watch history and canon order")
    public ResponseEntity<ApiResponse<RecommendationDto>> getRecommendations(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        Long currentUserId = userPrincipal != null ? userPrincipal.getId() : null;
        RecommendationDto dto = recommendationService.getRecommendationsForUser(currentUserId);
        return ResponseEntity.ok(ApiResponse.ok(dto));
    }
}
