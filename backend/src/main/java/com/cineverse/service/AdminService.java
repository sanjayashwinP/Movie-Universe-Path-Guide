package com.cineverse.service;

import com.cineverse.dto.*;
import com.cineverse.exception.BadRequestException;
import com.cineverse.exception.ResourceNotFoundException;
import com.cineverse.model.entity.*;
import com.cineverse.model.enums.ChangeStatus;
import com.cineverse.model.enums.ContentType;
import com.cineverse.model.enums.RelationshipType;
import com.cineverse.repository.*;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final ContentRepository contentRepository;
    private final FranchiseRepository franchiseRepository;
    private final UniverseRepository universeRepository;
    private final TimelineRepository timelineRepository;
    private final SagaRepository sagaRepository;
    private final PhaseRepository phaseRepository;
    private final AppUserRepository userRepository;
    private final PendingChangeRepository pendingChangeRepository;
    private final AnnouncementRepository announcementRepository;
    private final ContentRelationshipRepository relationshipRepository;
    private final AuditService auditService;
    private final ContentService contentService;

    public AdminService(ContentRepository contentRepository,
                        FranchiseRepository franchiseRepository,
                        UniverseRepository universeRepository,
                        TimelineRepository timelineRepository,
                        SagaRepository sagaRepository,
                        PhaseRepository phaseRepository,
                        AppUserRepository userRepository,
                        PendingChangeRepository pendingChangeRepository,
                        AnnouncementRepository announcementRepository,
                        ContentRelationshipRepository relationshipRepository,
                        AuditService auditService,
                        ContentService contentService) {
        this.contentRepository = contentRepository;
        this.franchiseRepository = franchiseRepository;
        this.universeRepository = universeRepository;
        this.timelineRepository = timelineRepository;
        this.sagaRepository = sagaRepository;
        this.phaseRepository = phaseRepository;
        this.userRepository = userRepository;
        this.pendingChangeRepository = pendingChangeRepository;
        this.announcementRepository = announcementRepository;
        this.relationshipRepository = relationshipRepository;
        this.auditService = auditService;
        this.contentService = contentService;
    }

    @Transactional(readOnly = true)
    public DashboardStatsDto getDashboardStats() {
        DashboardStatsDto dto = new DashboardStatsDto();
        dto.setTotalContent(contentRepository.count());
        dto.setTotalMovies(contentRepository.countByContentType(ContentType.MOVIE));
        dto.setTotalSeries(contentRepository.countByContentType(ContentType.TV_SERIES) + contentRepository.countByContentType(ContentType.LIMITED_SERIES));
        dto.setTotalSpecials(contentRepository.countByContentType(ContentType.SPECIAL_PRESENTATION) + contentRepository.countByContentType(ContentType.ONE_SHOT));
        dto.setTotalUpcoming((long) contentRepository.findUpcomingContent(PageRequest.of(0, 100)).size());
        dto.setTotalFranchises(franchiseRepository.count());
        dto.setTotalUniverses(universeRepository.count());
        dto.setTotalUsers(userRepository.count());
        dto.setPendingUpdatesCount(pendingChangeRepository.countByStatus(ChangeStatus.PENDING));

        dto.setRecentChanges(auditService.getRecentLogs());
        dto.setPendingApprovals(pendingChangeRepository.findByStatusOrderByDetectedAtDesc(ChangeStatus.PENDING).stream()
                .limit(10).map(pc -> {
                    PendingChangeDto pDto = new PendingChangeDto();
                    pDto.setId(pc.getId());
                    pDto.setProjectTitle(pc.getProjectTitle());
                    pDto.setFieldName(pc.getFieldName());
                    pDto.setOldValue(pc.getOldValue());
                    pDto.setNewValue(pc.getNewValue());
                    pDto.setStatus(pc.getStatus());
                    pDto.setDetectedAt(pc.getDetectedAt());
                    return pDto;
                }).collect(Collectors.toList()));

        dto.setUpcomingReleases(contentService.getUpcomingContent(5, null));

        return dto;
    }

    @Transactional
    public ContentDetailDto createContent(ContentCreateUpdateDto request, String adminUsername) {
        String slug = request.getSlug();
        if (slug == null || slug.trim().isEmpty()) {
            slug = request.getTitle().toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");
        }
        if (contentRepository.existsBySlug(slug)) {
            slug = slug + "-" + System.currentTimeMillis();
        }

        Franchise franchise = franchiseRepository.findById(request.getFranchiseId())
                .orElseThrow(() -> new ResourceNotFoundException("Franchise not found"));

        Content content = new Content();
        content.setTitle(request.getTitle());
        content.setOriginalTitle(request.getOriginalTitle());
        content.setSlug(slug);
        content.setContentType(request.getContentType());
        content.setStatus(request.getStatus());
        content.setReleaseDate(request.getReleaseDate());
        content.setReleaseYear(request.getReleaseYear() != null ? request.getReleaseYear() : (request.getReleaseDate() != null ? request.getReleaseDate().getYear() : null));
        content.setRuntimeMinutes(request.getRuntimeMinutes());
        content.setRating(request.getRating());
        content.setGenres(request.getGenres());
        content.setShortSynopsis(request.getShortSynopsis());
        content.setFullSynopsis(request.getFullSynopsis());
        content.setHasSpoilers(request.getHasSpoilers());
        content.setPostCreditScene(request.getPostCreditScene());
        content.setDirector(request.getDirector());
        content.setWriters(request.getWriters());
        content.setCastMembers(request.getCastMembers());
        content.setProductionStudio(request.getProductionStudio());
        content.setPosterUrl(request.getPosterUrl());
        content.setBackdropUrl(request.getBackdropUrl());
        content.setTrailerUrl(request.getTrailerUrl());
        content.setOfficialWebsiteUrl(request.getOfficialWebsiteUrl());

        content.setReleaseOrderNum(request.getReleaseOrderNum());
        content.setChronologicalOrderNum(request.getChronologicalOrderNum());
        content.setTimelineOrderNum(request.getTimelineOrderNum());
        content.setIsPublished(request.getIsPublished() != null ? request.getIsPublished() : true);

        content.setFranchise(franchise);

        if (request.getUniverseId() != null) {
            universeRepository.findById(request.getUniverseId()).ifPresent(content::setUniverse);
        }
        if (request.getTimelineId() != null) {
            timelineRepository.findById(request.getTimelineId()).ifPresent(content::setTimeline);
        }
        if (request.getSagaId() != null) {
            sagaRepository.findById(request.getSagaId()).ifPresent(content::setSaga);
        }
        if (request.getPhaseId() != null) {
            phaseRepository.findById(request.getPhaseId()).ifPresent(content::setPhase);
        }

        Content saved = contentRepository.save(content);

        // Add prerequisites & next watches if provided
        if (request.getPrerequisiteIds() != null) {
            for (Long prereqId : request.getPrerequisiteIds()) {
                contentRepository.findById(prereqId).ifPresent(prereq -> {
                    relationshipRepository.save(new ContentRelationship(prereq, saved, RelationshipType.PREREQUISITE, "Prerequisite"));
                });
            }
        }
        if (request.getNextWatchIds() != null) {
            for (Long nextId : request.getNextWatchIds()) {
                contentRepository.findById(nextId).ifPresent(next -> {
                    relationshipRepository.save(new ContentRelationship(saved, next, RelationshipType.NEXT_WATCH, "Recommended Next"));
                });
            }
        }

        auditService.logChange(adminUsername, "CREATE", "Content", saved.getId(), "title", null, saved.getTitle());

        return contentService.getContentDetail(saved.getId().toString(), null);
    }

    @Transactional
    public ContentDetailDto updateContent(Long id, ContentCreateUpdateDto request, String adminUsername) {
        Content content = contentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Content not found: " + id));

        // Diff tracking for audit
        if (!content.getTitle().equals(request.getTitle())) {
            auditService.logChange(adminUsername, "UPDATE", "Content", id, "title", content.getTitle(), request.getTitle());
            content.setTitle(request.getTitle());
        }
        if (request.getStatus() != null && content.getStatus() != request.getStatus()) {
            auditService.logChange(adminUsername, "UPDATE", "Content", id, "status", content.getStatus().name(), request.getStatus().name());
            content.setStatus(request.getStatus());
        }
        if (request.getReleaseDate() != null && !Objects.equals(content.getReleaseDate(), request.getReleaseDate())) {
            auditService.logChange(adminUsername, "UPDATE", "Content", id, "releaseDate",
                    content.getReleaseDate() != null ? content.getReleaseDate().toString() : "null",
                    request.getReleaseDate().toString());
            content.setReleaseDate(request.getReleaseDate());
            content.setReleaseYear(request.getReleaseDate().getYear());
        }

        content.setOriginalTitle(request.getOriginalTitle());
        if (request.getContentType() != null) content.setContentType(request.getContentType());
        if (request.getRuntimeMinutes() != null) content.setRuntimeMinutes(request.getRuntimeMinutes());
        content.setRating(request.getRating());
        content.setGenres(request.getGenres());
        content.setShortSynopsis(request.getShortSynopsis());
        content.setFullSynopsis(request.getFullSynopsis());
        content.setHasSpoilers(request.getHasSpoilers());
        content.setPostCreditScene(request.getPostCreditScene());
        content.setDirector(request.getDirector());
        content.setWriters(request.getWriters());
        content.setCastMembers(request.getCastMembers());
        content.setProductionStudio(request.getProductionStudio());
        content.setPosterUrl(request.getPosterUrl());
        content.setBackdropUrl(request.getBackdropUrl());
        content.setTrailerUrl(request.getTrailerUrl());
        content.setOfficialWebsiteUrl(request.getOfficialWebsiteUrl());

        content.setReleaseOrderNum(request.getReleaseOrderNum());
        content.setChronologicalOrderNum(request.getChronologicalOrderNum());
        content.setTimelineOrderNum(request.getTimelineOrderNum());
        if (request.getIsPublished() != null) content.setIsPublished(request.getIsPublished());

        if (request.getFranchiseId() != null) {
            franchiseRepository.findById(request.getFranchiseId()).ifPresent(content::setFranchise);
        }
        if (request.getUniverseId() != null) {
            universeRepository.findById(request.getUniverseId()).ifPresent(content::setUniverse);
        }
        if (request.getTimelineId() != null) {
            timelineRepository.findById(request.getTimelineId()).ifPresent(content::setTimeline);
        }
        if (request.getSagaId() != null) {
            sagaRepository.findById(request.getSagaId()).ifPresent(content::setSaga);
        }
        if (request.getPhaseId() != null) {
            phaseRepository.findById(request.getPhaseId()).ifPresent(content::setPhase);
        }

        Content updated = contentRepository.save(content);
        return contentService.getContentDetail(updated.getId().toString(), null);
    }

    @Transactional
    public void deleteContent(Long id, String adminUsername) {
        Content content = contentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Content not found: " + id));

        // Soft-delete / unpublish or remove
        content.setIsPublished(false);
        contentRepository.save(content);

        auditService.logChange(adminUsername, "DELETE", "Content", id, "isPublished", "true", "false (Archived)");
    }

    // Announcements
    @Transactional
    public Announcement createAnnouncement(Announcement announcement, String adminUsername) {
        Announcement saved = announcementRepository.save(announcement);
        auditService.logChange(adminUsername, "CREATE", "Announcement", saved.getId(), "title", null, saved.getTitle());
        return saved;
    }

    @Transactional(readOnly = true)
    public List<Announcement> getRecentAnnouncements() {
        return announcementRepository.findTop10ByOrderByPublishedAtDesc();
    }
}
