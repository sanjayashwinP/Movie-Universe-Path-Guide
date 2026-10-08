package com.cineverse.controller;

import com.cineverse.dto.*;
import com.cineverse.service.FranchiseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@Tag(name = "Taxonomies", description = "Franchises, Universes, Timelines, Sagas, and Phases")
public class FranchiseController {

    private final FranchiseService franchiseService;

    public FranchiseController(FranchiseService franchiseService) {
        this.franchiseService = franchiseService;
    }

    @GetMapping("/franchises")
    @Operation(summary = "List all active franchises")
    public ResponseEntity<ApiResponse<List<FranchiseDto>>> getAllFranchises() {
        return ResponseEntity.ok(ApiResponse.ok(franchiseService.getAllFranchises()));
    }

    @GetMapping("/franchises/{slug}")
    @Operation(summary = "Get franchise by slug with nested universes and sagas")
    public ResponseEntity<ApiResponse<FranchiseDto>> getFranchiseBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.ok(franchiseService.getFranchiseBySlug(slug)));
    }

    @GetMapping("/universes")
    @Operation(summary = "List universes (optionally filtered by franchiseId)")
    public ResponseEntity<ApiResponse<List<UniverseDto>>> getUniverses(
            @RequestParam(required = false) Long franchiseId) {
        return ResponseEntity.ok(ApiResponse.ok(franchiseService.getUniverses(franchiseId)));
    }

    @GetMapping("/timelines")
    @Operation(summary = "List timelines (optionally filtered by universeId)")
    public ResponseEntity<ApiResponse<List<TimelineDto>>> getTimelines(
            @RequestParam(required = false) Long universeId) {
        return ResponseEntity.ok(ApiResponse.ok(franchiseService.getTimelines(universeId)));
    }

    @GetMapping("/sagas")
    @Operation(summary = "List sagas (optionally filtered by franchiseId)")
    public ResponseEntity<ApiResponse<List<SagaDto>>> getSagas(
            @RequestParam(required = false) Long franchiseId) {
        return ResponseEntity.ok(ApiResponse.ok(franchiseService.getSagas(franchiseId)));
    }

    @GetMapping("/phases")
    @Operation(summary = "List phases (optionally filtered by sagaId)")
    public ResponseEntity<ApiResponse<List<PhaseDto>>> getPhases(
            @RequestParam(required = false) Long sagaId) {
        return ResponseEntity.ok(ApiResponse.ok(franchiseService.getPhases(sagaId)));
    }
}
