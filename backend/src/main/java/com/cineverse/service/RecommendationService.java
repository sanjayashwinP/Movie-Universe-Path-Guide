package com.cineverse.service;

import com.cineverse.dto.ContentSummaryDto;
import com.cineverse.dto.RecommendationDto;
import com.cineverse.model.entity.Content;
import com.cineverse.model.entity.WatchHistory;
import com.cineverse.model.enums.WatchlistStatus;
import com.cineverse.repository.ContentRelationshipRepository;
import com.cineverse.repository.ContentRepository;
import com.cineverse.repository.WatchHistoryRepository;
import com.cineverse.repository.WatchlistRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    private final WatchHistoryRepository watchHistoryRepository;
    private final WatchlistRepository watchlistRepository;
    private final ContentRepository contentRepository;
    private final ContentRelationshipRepository relationshipRepository;
    private final ContentService contentService;

    public RecommendationService(WatchHistoryRepository watchHistoryRepository,
                                 WatchlistRepository watchlistRepository,
                                 ContentRepository contentRepository,
                                 ContentRelationshipRepository relationshipRepository,
                                 ContentService contentService) {
        this.watchHistoryRepository = watchHistoryRepository;
        this.watchlistRepository = watchlistRepository;
        this.contentRepository = contentRepository;
        this.relationshipRepository = relationshipRepository;
        this.contentService = contentService;
    }

    @Transactional(readOnly = true)
    public RecommendationDto getRecommendationsForUser(Long userId) {
        Set<Long> watchedIds = userId != null ?
                new HashSet<>(watchHistoryRepository.findWatchedContentIdsByUserId(userId)) :
                Collections.emptySet();
        Map<Long, WatchlistStatus> watchlistMap = getWatchlistMap(userId);

        RecommendationDto dto = new RecommendationDto();

        // 1. Find last watched item
        Content lastWatched = null;
        if (userId != null) {
            var recentPage = watchHistoryRepository.findByUserIdOrderByWatchedAtDesc(userId, PageRequest.of(0, 1));
            if (!recentPage.isEmpty()) {
                lastWatched = recentPage.getContent().get(0).getContent();
            }
        }

        // If user hasn't watched anything yet, base it on the first chronological/release movie (e.g. Iron Man or Captain America)
        if (lastWatched == null) {
            var defaultFirst = contentRepository.findByReleaseOrder(null, null, PageRequest.of(0, 1));
            if (!defaultFirst.isEmpty()) {
                lastWatched = defaultFirst.getContent().get(0);
            }
        }

        if (lastWatched == null) {
            return dto; // No content in database yet
        }

        dto.setBasedOnContent(contentService.toSummaryDto(lastWatched, watchedIds, watchlistMap));

        // 2. Next Chronological Item not watched
        final Content anchor = lastWatched;
        if (anchor.getChronologicalOrderNum() != null) {
            List<Content> nextChronos = contentRepository.findAll().stream()
                    .filter(c -> Boolean.TRUE.equals(c.getIsPublished()))
                    .filter(c -> !watchedIds.contains(c.getId()))
                    .filter(c -> c.getChronologicalOrderNum() != null && c.getChronologicalOrderNum() > anchor.getChronologicalOrderNum())
                    .sorted(Comparator.comparing(Content::getChronologicalOrderNum))
                    .collect(Collectors.toList());

            if (!nextChronos.isEmpty()) {
                dto.setNextChronologicalWatch(contentService.toSummaryDto(nextChronos.get(0), watchedIds, watchlistMap));
            }
        }

        // 3. Next Release Order Item not watched
        if (anchor.getReleaseOrderNum() != null) {
            List<Content> nextReleases = contentRepository.findAll().stream()
                    .filter(c -> Boolean.TRUE.equals(c.getIsPublished()))
                    .filter(c -> !watchedIds.contains(c.getId()))
                    .filter(c -> c.getReleaseOrderNum() != null && c.getReleaseOrderNum() > anchor.getReleaseOrderNum())
                    .sorted(Comparator.comparing(Content::getReleaseOrderNum))
                    .collect(Collectors.toList());

            if (!nextReleases.isEmpty()) {
                dto.setNextReleaseOrderWatch(contentService.toSummaryDto(nextReleases.get(0), watchedIds, watchlistMap));
            }
        }

        // 4. Related Story items via graph relationships
        var rels = relationshipRepository.findWatchAfterByContentId(anchor.getId());
        List<ContentSummaryDto> relatedSummaries = rels.stream()
                .filter(r -> !watchedIds.contains(r.getTargetContent().getId()))
                .map(r -> contentService.toSummaryDto(r.getTargetContent(), watchedIds, watchlistMap))
                .collect(Collectors.toList());
        dto.setRelatedStoryContent(relatedSummaries);

        // 5. Same Saga items not watched
        if (anchor.getSaga() != null) {
            List<Content> sameSaga = contentRepository.findBySagaId(anchor.getSaga().getId()).stream()
                    .filter(c -> !watchedIds.contains(c.getId()))
                    .filter(c -> !c.getId().equals(anchor.getId()))
                    .limit(5)
                    .collect(Collectors.toList());
            dto.setSameSagaContent(sameSaga.stream().map(c -> contentService.toSummaryDto(c, watchedIds, watchlistMap)).collect(Collectors.toList()));
        }

        // 6. Same Universe items not watched
        if (anchor.getUniverse() != null) {
            List<Content> sameUni = contentRepository.findAll().stream()
                    .filter(c -> Boolean.TRUE.equals(c.getIsPublished()))
                    .filter(c -> c.getUniverse() != null && c.getUniverse().getId().equals(anchor.getUniverse().getId()))
                    .filter(c -> !watchedIds.contains(c.getId()))
                    .filter(c -> !c.getId().equals(anchor.getId()))
                    .limit(5)
                    .collect(Collectors.toList());
            dto.setSameUniverseContent(sameUni.stream().map(c -> contentService.toSummaryDto(c, watchedIds, watchlistMap)).collect(Collectors.toList()));
        }

        return dto;
    }

    private Map<Long, WatchlistStatus> getWatchlistMap(Long userId) {
        if (userId == null) return Collections.emptyMap();
        List<com.cineverse.model.entity.Watchlist> list = watchlistRepository.findByUserId(userId);
        Map<Long, WatchlistStatus> map = new HashMap<>();
        for (var w : list) map.put(w.getContent().getId(), w.getStatus());
        return map;
    }
}
