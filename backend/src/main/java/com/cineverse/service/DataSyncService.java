package com.cineverse.service;

import com.cineverse.dto.PendingChangeDto;
import com.cineverse.exception.ResourceNotFoundException;
import com.cineverse.model.entity.Content;
import com.cineverse.model.entity.ExternalSource;
import com.cineverse.model.entity.PendingChange;
import com.cineverse.model.enums.ChangeStatus;
import com.cineverse.model.enums.ContentStatus;
import com.cineverse.repository.ContentRepository;
import com.cineverse.repository.ExternalSourceRepository;
import com.cineverse.repository.PendingChangeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DataSyncService {

    private final PendingChangeRepository pendingChangeRepository;
    private final ExternalSourceRepository externalSourceRepository;
    private final ContentRepository contentRepository;
    private final AuditService auditService;

    public DataSyncService(PendingChangeRepository pendingChangeRepository,
                           ExternalSourceRepository externalSourceRepository,
                           ContentRepository contentRepository,
                           AuditService auditService) {
        this.pendingChangeRepository = pendingChangeRepository;
        this.externalSourceRepository = externalSourceRepository;
        this.contentRepository = contentRepository;
        this.auditService = auditService;
    }

    @Transactional(readOnly = true)
    public List<PendingChangeDto> getPendingChanges() {
        return pendingChangeRepository.findByStatusOrderByDetectedAtDesc(ChangeStatus.PENDING)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional
    public void approveChange(Long changeId, String adminUsername) {
        PendingChange change = pendingChangeRepository.findById(changeId)
                .orElseThrow(() -> new ResourceNotFoundException("Pending change not found: " + changeId));

        change.setStatus(ChangeStatus.APPROVED);
        change.setReviewedAt(LocalDateTime.now());
        change.setReviewedBy(adminUsername);
        pendingChangeRepository.save(change);

        // Apply change to content
        if (change.getContent() != null) {
            Content content = change.getContent();
            String field = change.getFieldName();
            String newVal = change.getNewValue();

            if ("releaseDate".equalsIgnoreCase(field) && newVal != null) {
                content.setReleaseDate(LocalDate.parse(newVal));
                content.setReleaseYear(content.getReleaseDate().getYear());
            } else if ("status".equalsIgnoreCase(field) && newVal != null) {
                content.setStatus(ContentStatus.valueOf(newVal));
            } else if ("title".equalsIgnoreCase(field) && newVal != null) {
                content.setTitle(newVal);
            }

            contentRepository.save(content);

            auditService.logChange(
                    adminUsername,
                    "SYNC_APPROVE",
                    "Content",
                    content.getId(),
                    change.getFieldName(),
                    change.getOldValue(),
                    change.getNewValue()
            );
        }
    }

    @Transactional
    public void rejectChange(Long changeId, String adminUsername) {
        PendingChange change = pendingChangeRepository.findById(changeId)
                .orElseThrow(() -> new ResourceNotFoundException("Pending change not found: " + changeId));

        change.setStatus(ChangeStatus.REJECTED);
        change.setReviewedAt(LocalDateTime.now());
        change.setReviewedBy(adminUsername);
        pendingChangeRepository.save(change);

        auditService.logChange(
                adminUsername,
                "SYNC_REJECT",
                "PendingChange",
                changeId,
                change.getFieldName(),
                change.getOldValue(),
                "REJECTED"
        );
    }

    @Transactional
    public int triggerSourceScanSimulation() {
        // Simulates an official feed scan that detects changes for upcoming content
        List<ExternalSource> sources = externalSourceRepository.findByIsActiveTrue();
        if (sources.isEmpty()) {
            return 0;
        }
        ExternalSource source = sources.get(0);

        // Look for an upcoming movie to detect an official release date adjustment
        List<Content> upcoming = contentRepository.findAll().stream()
                .filter(c -> c.getStatus() == ContentStatus.UPCOMING || c.getStatus() == ContentStatus.ANNOUNCED)
                .collect(Collectors.toList());

        if (upcoming.isEmpty()) return 0;

        Content target = upcoming.get(0);
        String oldDate = target.getReleaseDate() != null ? target.getReleaseDate().toString() : "TBA";
        String newDate = "2027-07-23";

        // Check if pending change already exists
        boolean alreadyPending = pendingChangeRepository.findByStatusOrderByDetectedAtDesc(ChangeStatus.PENDING)
                .stream().anyMatch(pc -> pc.getContent() != null && pc.getContent().getId().equals(target.getId()));

        if (!alreadyPending) {
            PendingChange change = new PendingChange(
                    source,
                    target,
                    target.getTitle(),
                    "releaseDate",
                    oldDate,
                    newDate,
                    "https://marvel.com/news/official-dates-update"
            );
            pendingChangeRepository.save(change);
            return 1;
        }

        return 0;
    }

    public PendingChangeDto toDto(PendingChange pc) {
        PendingChangeDto dto = new PendingChangeDto();
        dto.setId(pc.getId());
        dto.setSourceId(pc.getSource() != null ? pc.getSource().getId() : null);
        dto.setSourceName(pc.getSource() != null ? pc.getSource().getName() : "Official Feed");
        dto.setContentId(pc.getContent() != null ? pc.getContent().getId() : null);
        dto.setContentTitle(pc.getContent() != null ? pc.getContent().getTitle() : pc.getProjectTitle());
        dto.setProjectTitle(pc.getProjectTitle());
        dto.setFieldName(pc.getFieldName());
        dto.setOldValue(pc.getOldValue());
        dto.setNewValue(pc.getNewValue());
        dto.setStatus(pc.getStatus());
        dto.setSourceReferenceUrl(pc.getSourceReferenceUrl());
        dto.setDetectedAt(pc.getDetectedAt());
        dto.setReviewedAt(pc.getReviewedAt());
        dto.setReviewedBy(pc.getReviewedBy());
        return dto;
    }
}
