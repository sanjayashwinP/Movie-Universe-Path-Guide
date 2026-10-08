package com.cineverse.controller;

import com.cineverse.dto.*;
import com.cineverse.model.entity.Announcement;
import com.cineverse.security.UserPrincipal;
import com.cineverse.service.AdminService;
import com.cineverse.service.AuditService;
import com.cineverse.service.DataSyncService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin", description = "Administration, content curation, sync approvals, and audit trail")
public class AdminController {

    private final AdminService adminService;
    private final AuditService auditService;
    private final DataSyncService dataSyncService;

    public AdminController(AdminService adminService,
                           AuditService auditService,
                           DataSyncService dataSyncService) {
        this.adminService = adminService;
        this.auditService = auditService;
        this.dataSyncService = dataSyncService;
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get admin dashboard KPI metrics and recent changes")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getDashboardStats() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getDashboardStats()));
    }

    @PostMapping("/content")
    @Operation(summary = "Create new canonical content item")
    public ResponseEntity<ApiResponse<ContentDetailDto>> createContent(
            @Valid @RequestBody ContentCreateUpdateDto request,
            @AuthenticationPrincipal UserPrincipal adminPrincipal) {

        ContentDetailDto created = adminService.createContent(request, adminPrincipal.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Content published successfully", created));
    }

    @PutMapping("/content/{id}")
    @Operation(summary = "Update content item and track audit diff")
    public ResponseEntity<ApiResponse<ContentDetailDto>> updateContent(
            @PathVariable Long id,
            @Valid @RequestBody ContentCreateUpdateDto request,
            @AuthenticationPrincipal UserPrincipal adminPrincipal) {

        ContentDetailDto updated = adminService.updateContent(id, request, adminPrincipal.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Content updated successfully", updated));
    }

    @DeleteMapping("/content/{id}")
    @Operation(summary = "Archive or soft-delete content item")
    public ResponseEntity<ApiResponse<Void>> deleteContent(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal adminPrincipal) {

        adminService.deleteContent(id, adminPrincipal.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Content archived successfully", null));
    }

    @GetMapping("/audit-logs")
    @Operation(summary = "View system change audit trail with old vs new diffs")
    public ResponseEntity<ApiResponse<Page<AuditLogDto>>> getAuditLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(ApiResponse.ok(auditService.getAllLogs(pageable)));
    }

    @GetMapping("/sync/pending")
    @Operation(summary = "List pending changes detected from official external sources")
    public ResponseEntity<ApiResponse<List<PendingChangeDto>>> getPendingSyncChanges() {
        return ResponseEntity.ok(ApiResponse.ok(dataSyncService.getPendingChanges()));
    }

    @PostMapping("/sync/approve/{id}")
    @Operation(summary = "Approve pending external change and apply to official content")
    public ResponseEntity<ApiResponse<Void>> approveSyncChange(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal adminPrincipal) {

        dataSyncService.approveChange(id, adminPrincipal.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Change approved and published", null));
    }

    @PostMapping("/sync/reject/{id}")
    @Operation(summary = "Reject pending external change")
    public ResponseEntity<ApiResponse<Void>> rejectSyncChange(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal adminPrincipal) {

        dataSyncService.rejectChange(id, adminPrincipal.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Change rejected", null));
    }

    @PostMapping("/sync/trigger")
    @Operation(summary = "Trigger official sources synchronization check simulation")
    public ResponseEntity<ApiResponse<Integer>> triggerSyncCheck() {
        int detected = dataSyncService.triggerSourceScanSimulation();
        return ResponseEntity.ok(ApiResponse.ok("Official source check completed. New pending changes: " + detected, detected));
    }

    @PostMapping("/announcements")
    @Operation(summary = "Post official franchise announcement")
    public ResponseEntity<ApiResponse<Announcement>> createAnnouncement(
            @Valid @RequestBody Announcement announcement,
            @AuthenticationPrincipal UserPrincipal adminPrincipal) {

        Announcement created = adminService.createAnnouncement(announcement, adminPrincipal.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Announcement posted", created));
    }
}
