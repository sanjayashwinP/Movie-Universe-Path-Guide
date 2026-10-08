package com.cineverse.controller;

import com.cineverse.dto.AnnouncementDto;
import com.cineverse.dto.ApiResponse;
import com.cineverse.dto.StatsOverviewDto;
import com.cineverse.model.entity.Announcement;
import com.cineverse.model.enums.ContentType;
import com.cineverse.repository.AnnouncementRepository;
import com.cineverse.repository.ContentRepository;
import com.cineverse.repository.FranchiseRepository;
import com.cineverse.repository.UniverseRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@Tag(name = "Platform Statistics & Announcements", description = "Global metadata overview and official bulletins")
public class StatsController {

    private final ContentRepository contentRepository;
    private final FranchiseRepository franchiseRepository;
    private final UniverseRepository universeRepository;
    private final AnnouncementRepository announcementRepository;

    public StatsController(ContentRepository contentRepository,
                           FranchiseRepository franchiseRepository,
                           UniverseRepository universeRepository,
                           AnnouncementRepository announcementRepository) {
        this.contentRepository = contentRepository;
        this.franchiseRepository = franchiseRepository;
        this.universeRepository = universeRepository;
        this.announcementRepository = announcementRepository;
    }

    @GetMapping({"/stats", "/stats/overview"})
    @Operation(summary = "Get platform-wide content counts and universe metrics")
    public ResponseEntity<ApiResponse<StatsOverviewDto>> getStatsOverview() {
        StatsOverviewDto dto = new StatsOverviewDto();
        dto.setTotalContent(contentRepository.count());
        dto.setTotalMovies(contentRepository.countByContentType(ContentType.MOVIE));
        dto.setTotalSeries(contentRepository.countByContentType(ContentType.TV_SERIES) + contentRepository.countByContentType(ContentType.LIMITED_SERIES));
        dto.setTotalSpecials(contentRepository.countByContentType(ContentType.SPECIAL_PRESENTATION) + contentRepository.countByContentType(ContentType.ONE_SHOT));
        dto.setTotalUpcoming((long) contentRepository.findUpcomingContent(PageRequest.of(0, 100)).size());
        dto.setTotalFranchises(franchiseRepository.count());
        dto.setTotalUniverses(universeRepository.count());
        return ResponseEntity.ok(ApiResponse.ok(dto));
    }

    @GetMapping("/announcements")
    @Operation(summary = "Get latest official franchise announcements")
    public ResponseEntity<ApiResponse<List<AnnouncementDto>>> getAnnouncements() {
        List<Announcement> list = announcementRepository.findTop10ByOrderByPublishedAtDesc();
        List<AnnouncementDto> dtos = list.stream().map(a -> {
            AnnouncementDto dto = new AnnouncementDto();
            dto.setId(a.getId());
            dto.setTitle(a.getTitle());
            dto.setDescription(a.getDescription());
            dto.setType(a.getType());
            dto.setRelatedFranchise(a.getRelatedFranchise());
            dto.setOfficialUrl(a.getOfficialUrl());
            dto.setPublishedAt(a.getPublishedAt());
            return dto;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok(dtos));
    }
}
