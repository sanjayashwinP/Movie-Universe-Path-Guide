package com.cineverse.service;

import com.cineverse.dto.ContentSummaryDto;
import com.cineverse.model.entity.Content;
import com.cineverse.model.entity.Phase;
import com.cineverse.model.entity.Saga;
import com.cineverse.model.enums.WatchlistStatus;
import com.cineverse.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class WatchOrderService {

    private final ContentRepository contentRepository;
    private final SagaRepository sagaRepository;
    private final PhaseRepository phaseRepository;
    private final WatchHistoryRepository watchHistoryRepository;
    private final WatchlistRepository watchlistRepository;
    private final ContentService contentService;

    public WatchOrderService(ContentRepository contentRepository,
                             SagaRepository sagaRepository,
                             PhaseRepository phaseRepository,
                             WatchHistoryRepository watchHistoryRepository,
                             WatchlistRepository watchlistRepository,
                             ContentService contentService) {
        this.contentRepository = contentRepository;
        this.sagaRepository = sagaRepository;
        this.phaseRepository = phaseRepository;
        this.watchHistoryRepository = watchHistoryRepository;
        this.watchlistRepository = watchlistRepository;
        this.contentService = contentService;
    }

    @Transactional(readOnly = true)
    public Page<ContentSummaryDto> getReleaseOrder(Long franchiseId, Long universeId, Long currentUserId, Pageable pageable) {
        Set<Long> watchedIds = getWatchedIdsForUser(currentUserId);
        Map<Long, WatchlistStatus> watchlistMap = getWatchlistMapForUser(currentUserId);
        return contentRepository.findByReleaseOrder(franchiseId, universeId, pageable)
                .map(c -> contentService.toSummaryDto(c, watchedIds, watchlistMap));
    }

    @Transactional(readOnly = true)
    public Page<ContentSummaryDto> getChronologicalOrder(Long franchiseId, Long universeId, Long currentUserId, Pageable pageable) {
        Set<Long> watchedIds = getWatchedIdsForUser(currentUserId);
        Map<Long, WatchlistStatus> watchlistMap = getWatchlistMapForUser(currentUserId);
        return contentRepository.findByChronologicalOrder(franchiseId, universeId, pageable)
                .map(c -> contentService.toSummaryDto(c, watchedIds, watchlistMap));
    }

    @Transactional(readOnly = true)
    public Page<ContentSummaryDto> getTimelineOrder(Long timelineId, Long currentUserId, Pageable pageable) {
        Set<Long> watchedIds = getWatchedIdsForUser(currentUserId);
        Map<Long, WatchlistStatus> watchlistMap = getWatchlistMapForUser(currentUserId);
        return contentRepository.findByTimelineOrder(timelineId, pageable)
                .map(c -> contentService.toSummaryDto(c, watchedIds, watchlistMap));
    }

    @Transactional(readOnly = true)
    public Page<ContentSummaryDto> getMainTimelineOrder(Long universeId, Long currentUserId, Pageable pageable) {
        Set<Long> watchedIds = getWatchedIdsForUser(currentUserId);
        Map<Long, WatchlistStatus> watchlistMap = getWatchlistMapForUser(currentUserId);
        return contentRepository.findByMainTimelineOrder(universeId, pageable)
                .map(c -> contentService.toSummaryDto(c, watchedIds, watchlistMap));
    }

    @Transactional(readOnly = true)
    public List<ContentSummaryDto> getSagaOrder(Long sagaId, Long currentUserId) {
        Set<Long> watchedIds = getWatchedIdsForUser(currentUserId);
        Map<Long, WatchlistStatus> watchlistMap = getWatchlistMapForUser(currentUserId);
        List<Content> contents = contentRepository.findBySagaId(sagaId);
        return contents.stream()
                .map(c -> contentService.toSummaryDto(c, watchedIds, watchlistMap))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ContentSummaryDto> getPhaseOrder(Long phaseId, Long currentUserId) {
        Set<Long> watchedIds = getWatchedIdsForUser(currentUserId);
        Map<Long, WatchlistStatus> watchlistMap = getWatchlistMapForUser(currentUserId);
        List<Content> contents = contentRepository.findByPhaseId(phaseId);
        return contents.stream()
                .map(c -> contentService.toSummaryDto(c, watchedIds, watchlistMap))
                .collect(Collectors.toList());
    }

    private Set<Long> getWatchedIdsForUser(Long userId) {
        if (userId == null) return Collections.emptySet();
        return new HashSet<>(watchHistoryRepository.findWatchedContentIdsByUserId(userId));
    }

    private Map<Long, WatchlistStatus> getWatchlistMapForUser(Long userId) {
        if (userId == null) return Collections.emptyMap();
        List<com.cineverse.model.entity.Watchlist> list = watchlistRepository.findByUserId(userId);
        Map<Long, WatchlistStatus> map = new HashMap<>();
        for (var w : list) {
            map.put(w.getContent().getId(), w.getStatus());
        }
        return map;
    }
}
