package com.cineverse.controller;

import com.cineverse.dto.ApiResponse;
import com.cineverse.dto.ContentSummaryDto;
import com.cineverse.security.UserPrincipal;
import com.cineverse.service.WatchOrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/watch-orders")
@Tag(name = "Watch Orders", description = "Theatrical, Chronological, Timeline, and Saga ordering")
public class WatchOrderController {

    private final WatchOrderService watchOrderService;

    public WatchOrderController(WatchOrderService watchOrderService) {
        this.watchOrderService = watchOrderService;
    }

    @GetMapping("/release")
    @Operation(summary = "Order content by official theatrical / broadcast release date")
    public ResponseEntity<ApiResponse<Page<ContentSummaryDto>>> getReleaseOrder(
            @RequestParam(required = false) Long franchiseId,
            @RequestParam(required = false) Long universeId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        Long currentUserId = userPrincipal != null ? userPrincipal.getId() : null;
        Pageable pageable = PageRequest.of(page, size);
        Page<ContentSummaryDto> results = watchOrderService.getReleaseOrder(franchiseId, universeId, currentUserId, pageable);
        return ResponseEntity.ok(ApiResponse.ok(results));
    }

    @GetMapping("/chronological")
    @Operation(summary = "Order content by in-universe story chronology")
    public ResponseEntity<ApiResponse<Page<ContentSummaryDto>>> getChronologicalOrder(
            @RequestParam(required = false) Long franchiseId,
            @RequestParam(required = false) Long universeId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        Long currentUserId = userPrincipal != null ? userPrincipal.getId() : null;
        Pageable pageable = PageRequest.of(page, size);
        Page<ContentSummaryDto> results = watchOrderService.getChronologicalOrder(franchiseId, universeId, currentUserId, pageable);
        return ResponseEntity.ok(ApiResponse.ok(results));
    }

    @GetMapping("/timeline")
    @Operation(summary = "Order content belonging to a specific timeline branch")
    public ResponseEntity<ApiResponse<Page<ContentSummaryDto>>> getTimelineOrder(
            @RequestParam Long timelineId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        Long currentUserId = userPrincipal != null ? userPrincipal.getId() : null;
        Pageable pageable = PageRequest.of(page, size);
        Page<ContentSummaryDto> results = watchOrderService.getTimelineOrder(timelineId, currentUserId, pageable);
        return ResponseEntity.ok(ApiResponse.ok(results));
    }

    @GetMapping("/main-timeline")
    @Operation(summary = "Order content strictly restricted to the sacred / main canon timeline")
    public ResponseEntity<ApiResponse<Page<ContentSummaryDto>>> getMainTimelineOrder(
            @RequestParam(required = false) Long universeId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        Long currentUserId = userPrincipal != null ? userPrincipal.getId() : null;
        Pageable pageable = PageRequest.of(page, size);
        Page<ContentSummaryDto> results = watchOrderService.getMainTimelineOrder(universeId, currentUserId, pageable);
        return ResponseEntity.ok(ApiResponse.ok(results));
    }

    @GetMapping("/saga/{sagaId}")
    @Operation(summary = "Order content within an overarching saga (Phase by Phase)")
    public ResponseEntity<ApiResponse<List<ContentSummaryDto>>> getSagaOrder(
            @PathVariable Long sagaId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        Long currentUserId = userPrincipal != null ? userPrincipal.getId() : null;
        List<ContentSummaryDto> results = watchOrderService.getSagaOrder(sagaId, currentUserId);
        return ResponseEntity.ok(ApiResponse.ok(results));
    }

    @GetMapping("/phase/{phaseId}")
    @Operation(summary = "Order content within a specific narrative phase")
    public ResponseEntity<ApiResponse<List<ContentSummaryDto>>> getPhaseOrder(
            @PathVariable Long phaseId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        Long currentUserId = userPrincipal != null ? userPrincipal.getId() : null;
        List<ContentSummaryDto> results = watchOrderService.getPhaseOrder(phaseId, currentUserId);
        return ResponseEntity.ok(ApiResponse.ok(results));
    }
}
