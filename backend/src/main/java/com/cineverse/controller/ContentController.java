package com.cineverse.controller;

import com.cineverse.dto.ApiResponse;
import com.cineverse.dto.ContentDetailDto;
import com.cineverse.dto.ContentSummaryDto;
import com.cineverse.dto.MovieRoadmapDto;
import com.cineverse.model.enums.ContentStatus;
import com.cineverse.model.enums.ContentType;
import com.cineverse.security.UserPrincipal;
import com.cineverse.service.ContentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@Tag(name = "Content", description = "Cinematic Universe Movies, Series, and Specials")
public class ContentController {

    private final ContentService contentService;

    public ContentController(ContentService contentService) {
        this.contentService = contentService;
    }

    @GetMapping("/content")
    @Operation(summary = "Explore and filter content with pagination")
    public ResponseEntity<ApiResponse<Page<ContentSummaryDto>>> getFilteredContent(
            @RequestParam(required = false) Long franchiseId,
            @RequestParam(required = false) Long universeId,
            @RequestParam(required = false) Long timelineId,
            @RequestParam(required = false) Long sagaId,
            @RequestParam(required = false) Long phaseId,
            @RequestParam(required = false) ContentType contentType,
            @RequestParam(required = false) ContentStatus status,
            @RequestParam(required = false) Integer releaseYear,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "releaseDate,asc") String[] sort,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        Sort sortOrder = Sort.by(Sort.Direction.fromString(sort.length > 1 ? sort[1] : "asc"), sort[0]);
        Pageable pageable = PageRequest.of(page, size, sortOrder);

        Long currentUserId = userPrincipal != null ? userPrincipal.getId() : null;

        Page<ContentSummaryDto> results = contentService.getFilteredContent(
                franchiseId, universeId, timelineId, sagaId, phaseId,
                contentType, status, releaseYear, search,
                currentUserId, pageable
        );

        return ResponseEntity.ok(ApiResponse.ok(results));
    }

    @GetMapping("/content/{slugOrId}")
    @Operation(summary = "Get comprehensive content detail with 'Where Does This Fit' and 'Before and After'")
    public ResponseEntity<ApiResponse<ContentDetailDto>> getContentDetail(
            @PathVariable String slugOrId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        Long currentUserId = userPrincipal != null ? userPrincipal.getId() : null;
        ContentDetailDto detail = contentService.getContentDetail(slugOrId, currentUserId);
        return ResponseEntity.ok(ApiResponse.ok(detail));
    }

    @GetMapping("/content/upcoming")
    @Operation(summary = "Get upcoming releases ordered by expected release date")
    public ResponseEntity<ApiResponse<List<ContentSummaryDto>>> getUpcomingContent(
            @RequestParam(defaultValue = "10") int limit,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        Long currentUserId = userPrincipal != null ? userPrincipal.getId() : null;
        List<ContentSummaryDto> upcoming = contentService.getUpcomingContent(limit, currentUserId);
        return ResponseEntity.ok(ApiResponse.ok(upcoming));
    }

    @GetMapping({"/search", "/content/search"})
    @Operation(summary = "Global search across titles, characters, actors, and universes")
    public ResponseEntity<ApiResponse<Page<ContentSummaryDto>>> search(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        String keyword = query != null ? query : (q != null ? q : "");
        Long currentUserId = userPrincipal != null ? userPrincipal.getId() : null;
        Pageable pageable = PageRequest.of(page, size);
        Page<ContentSummaryDto> results = contentService.search(keyword, currentUserId, pageable);
        return ResponseEntity.ok(ApiResponse.ok(results));
    }

    @GetMapping("/content/{slugOrId}/roadmap")
    @Operation(summary = "Get sequential prerequisite roadmap from scratch (#1 origin) up to this movie")
    public ResponseEntity<ApiResponse<MovieRoadmapDto>> getMovieRoadmap(
            @PathVariable String slugOrId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        Long currentUserId = userPrincipal != null ? userPrincipal.getId() : null;
        MovieRoadmapDto roadmap = contentService.getMovieRoadmap(slugOrId, currentUserId);
        return ResponseEntity.ok(ApiResponse.ok(roadmap));
    }

    @GetMapping("/content/roadmap")
    @Operation(summary = "Query movie roadmap from scratch by title or id")
    public ResponseEntity<ApiResponse<MovieRoadmapDto>> queryMovieRoadmap(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        String key = id != null ? String.valueOf(id) : (title != null ? title : (q != null ? q : ""));
        Long currentUserId = userPrincipal != null ? userPrincipal.getId() : null;
        MovieRoadmapDto roadmap = contentService.getMovieRoadmap(key, currentUserId);
        return ResponseEntity.ok(ApiResponse.ok(roadmap));
    }
}
