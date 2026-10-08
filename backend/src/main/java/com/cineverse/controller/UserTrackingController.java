package com.cineverse.controller;

import com.cineverse.dto.*;
import com.cineverse.model.enums.WatchlistStatus;
import com.cineverse.security.UserPrincipal;
import com.cineverse.service.UserTrackingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@Tag(name = "User Tracking", description = "Watch history, watchlist, episode tracking, and progress metrics")
public class UserTrackingController {

    private final UserTrackingService userTrackingService;

    public UserTrackingController(UserTrackingService userTrackingService) {
        this.userTrackingService = userTrackingService;
    }

    @PostMapping("/watch/{contentId}")
    @Operation(summary = "Toggle movie or series as watched / unwatched")
    public ResponseEntity<ApiResponse<Boolean>> toggleWatched(
            @PathVariable Long contentId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        boolean isWatched = userTrackingService.toggleContentWatched(userPrincipal.getId(), contentId);
        String msg = isWatched ? "Marked as watched" : "Removed from watched history";
        return ResponseEntity.ok(ApiResponse.ok(msg, isWatched));
    }

    @GetMapping("/watchlist")
    @Operation(summary = "Get user's personal watchlist")
    public ResponseEntity<ApiResponse<Page<WatchlistDto>>> getWatchlist(
            @RequestParam(required = false) WatchlistStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        Pageable pageable = PageRequest.of(page, size);
        Page<WatchlistDto> results = userTrackingService.getUserWatchlist(userPrincipal.getId(), status, pageable);
        return ResponseEntity.ok(ApiResponse.ok(results));
    }

    @PostMapping("/watchlist/{contentId}")
    @Operation(summary = "Add or update content in personal watchlist")
    public ResponseEntity<ApiResponse<WatchlistDto>> updateWatchlist(
            @PathVariable Long contentId,
            @Valid @RequestBody WatchlistRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        WatchlistDto dto = userTrackingService.updateWatchlist(userPrincipal.getId(), contentId, request);
        return ResponseEntity.ok(ApiResponse.ok("Watchlist updated", dto));
    }

    @DeleteMapping("/watchlist/{contentId}")
    @Operation(summary = "Remove content from personal watchlist")
    public ResponseEntity<ApiResponse<Void>> removeFromWatchlist(
            @PathVariable Long contentId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        userTrackingService.removeFromWatchlist(userPrincipal.getId(), contentId);
        return ResponseEntity.ok(ApiResponse.ok("Removed from watchlist", null));
    }

    @GetMapping("/history")
    @Operation(summary = "Get user's watched history with timestamp order")
    public ResponseEntity<ApiResponse<Page<ContentSummaryDto>>> getWatchHistory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        Pageable pageable = PageRequest.of(page, size);
        Page<ContentSummaryDto> history = userTrackingService.getUserWatchHistory(userPrincipal.getId(), pageable);
        return ResponseEntity.ok(ApiResponse.ok(history));
    }

    @PostMapping("/episodes/{episodeId}/toggle")
    @Operation(summary = "Toggle individual episode watched state")
    public ResponseEntity<ApiResponse<Boolean>> toggleEpisodeWatched(
            @PathVariable Long episodeId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        boolean isWatched = userTrackingService.toggleEpisodeWatched(userPrincipal.getId(), episodeId);
        return ResponseEntity.ok(ApiResponse.ok(isWatched ? "Episode marked watched" : "Episode marked unwatched", isWatched));
    }

    @GetMapping("/progress")
    @Operation(summary = "Get user's complete watch statistics, completion percentages, and favorites")
    public ResponseEntity<ApiResponse<UserProgressDto>> getUserProgress(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        UserProgressDto progress = userTrackingService.getUserProgress(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok(progress));
    }
}
