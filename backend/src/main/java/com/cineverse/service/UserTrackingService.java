package com.cineverse.service;

import com.cineverse.dto.*;
import com.cineverse.exception.ResourceNotFoundException;
import com.cineverse.model.entity.*;
import com.cineverse.model.enums.ContentType;
import com.cineverse.model.enums.WatchlistStatus;
import com.cineverse.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserTrackingService {

    private final AppUserRepository userRepository;
    private final ContentRepository contentRepository;
    private final WatchHistoryRepository watchHistoryRepository;
    private final WatchlistRepository watchlistRepository;
    private final EpisodeRepository episodeRepository;
    private final EpisodeProgressRepository episodeProgressRepository;
    private final SagaRepository sagaRepository;
    private final UniverseRepository universeRepository;
    private final ContentService contentService;

    public UserTrackingService(AppUserRepository userRepository,
                               ContentRepository contentRepository,
                               WatchHistoryRepository watchHistoryRepository,
                               WatchlistRepository watchlistRepository,
                               EpisodeRepository episodeRepository,
                               EpisodeProgressRepository episodeProgressRepository,
                               SagaRepository sagaRepository,
                               UniverseRepository universeRepository,
                               ContentService contentService) {
        this.userRepository = userRepository;
        this.contentRepository = contentRepository;
        this.watchHistoryRepository = watchHistoryRepository;
        this.watchlistRepository = watchlistRepository;
        this.episodeRepository = episodeRepository;
        this.episodeProgressRepository = episodeProgressRepository;
        this.sagaRepository = sagaRepository;
        this.universeRepository = universeRepository;
        this.contentService = contentService;
    }

    @Transactional
    public boolean toggleContentWatched(Long userId, Long contentId) {
        AppUser user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Content content = contentRepository.findById(contentId)
                .orElseThrow(() -> new ResourceNotFoundException("Content not found"));

        Optional<WatchHistory> existing = watchHistoryRepository.findByUserIdAndContentId(userId, contentId);
        if (existing.isPresent()) {
            watchHistoryRepository.delete(existing.get());
            // If it's in watchlist with status COMPLETED, revert to WANT_TO_WATCH or leave as is
            watchlistRepository.findByUserIdAndContentId(userId, contentId).ifPresent(wl -> {
                if (wl.getStatus() == WatchlistStatus.COMPLETED) {
                    wl.setStatus(WatchlistStatus.WANT_TO_WATCH);
                    watchlistRepository.save(wl);
                }
            });
            return false;
        } else {
            WatchHistory history = new WatchHistory(user, content);
            watchHistoryRepository.save(history);

            // Also update watchlist if exists
            watchlistRepository.findByUserIdAndContentId(userId, contentId).ifPresent(wl -> {
                wl.setStatus(WatchlistStatus.COMPLETED);
                watchlistRepository.save(wl);
            });

            // If it's a TV series, mark all its episodes as watched
            List<Episode> episodes = episodeRepository.findAllByContentId(contentId);
            for (Episode ep : episodes) {
                if (episodeProgressRepository.findByUserIdAndEpisodeId(userId, ep.getId()).isEmpty()) {
                    episodeProgressRepository.save(new EpisodeProgress(user, ep, true));
                }
            }
            return true;
        }
    }

    @Transactional
    public WatchlistDto updateWatchlist(Long userId, Long contentId, WatchlistRequest request) {
        AppUser user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Content content = contentRepository.findById(contentId)
                .orElseThrow(() -> new ResourceNotFoundException("Content not found"));

        Watchlist watchlist = watchlistRepository.findByUserIdAndContentId(userId, contentId)
                .orElseGet(() -> new Watchlist(user, content, request.getStatus()));

        watchlist.setStatus(request.getStatus());
        if (request.getUserRating() != null) watchlist.setUserRating(request.getUserRating());
        if (request.getNotes() != null) watchlist.setNotes(request.getNotes());
        watchlistRepository.save(watchlist);

        if (request.getStatus() == WatchlistStatus.COMPLETED) {
            if (!watchHistoryRepository.existsByUserIdAndContentId(userId, contentId)) {
                watchHistoryRepository.save(new WatchHistory(user, content));
            }
        }

        return toWatchlistDto(watchlist);
    }

    @Transactional
    public void removeFromWatchlist(Long userId, Long contentId) {
        watchlistRepository.deleteByUserIdAndContentId(userId, contentId);
    }

    @Transactional(readOnly = true)
    public Page<WatchlistDto> getUserWatchlist(Long userId, WatchlistStatus status, Pageable pageable) {
        Page<Watchlist> page = status != null ?
                watchlistRepository.findByUserIdAndStatus(userId, status, pageable) :
                watchlistRepository.findByUserId(userId, pageable);
        return page.map(this::toWatchlistDto);
    }

    @Transactional(readOnly = true)
    public Page<ContentSummaryDto> getUserWatchHistory(Long userId, Pageable pageable) {
        Page<WatchHistory> page = watchHistoryRepository.findByUserIdOrderByWatchedAtDesc(userId, pageable);
        Set<Long> watchedIds = new HashSet<>(watchHistoryRepository.findWatchedContentIdsByUserId(userId));
        Map<Long, WatchlistStatus> watchlistMap = getWatchlistMap(userId);
        return page.map(wh -> contentService.toSummaryDto(wh.getContent(), watchedIds, watchlistMap));
    }

    @Transactional
    public boolean toggleEpisodeWatched(Long userId, Long episodeId) {
        AppUser user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Episode episode = episodeRepository.findById(episodeId)
                .orElseThrow(() -> new ResourceNotFoundException("Episode not found"));

        Optional<EpisodeProgress> existing = episodeProgressRepository.findByUserIdAndEpisodeId(userId, episodeId);
        boolean isNowWatched;
        if (existing.isPresent()) {
            episodeProgressRepository.delete(existing.get());
            isNowWatched = false;
        } else {
            episodeProgressRepository.save(new EpisodeProgress(user, episode, true));
            isNowWatched = true;
        }

        // Check if all episodes of content are now watched
        Long contentId = episode.getSeason().getContent().getId();
        Long totalEpisodes = episodeRepository.countByContentId(contentId);
        Long watchedEpisodes = episodeProgressRepository.countWatchedEpisodesByUserIdAndContentId(userId, contentId);

        if (totalEpisodes > 0 && watchedEpisodes.equals(totalEpisodes)) {
            if (!watchHistoryRepository.existsByUserIdAndContentId(userId, contentId)) {
                watchHistoryRepository.save(new WatchHistory(user, episode.getSeason().getContent()));
            }
        } else {
            // Not completely watched
            watchHistoryRepository.findByUserIdAndContentId(userId, contentId).ifPresent(watchHistoryRepository::delete);
        }

        return isNowWatched;
    }

    @Transactional(readOnly = true)
    public UserProgressDto getUserProgress(Long userId) {
        UserProgressDto dto = new UserProgressDto();
        long totalContent = contentRepository.count();
        List<WatchHistory> histories = watchHistoryRepository.findByUserId(userId);
        long watchedCount = histories.size();

        dto.setTotalContentAvailable(totalContent);
        dto.setTotalWatched(watchedCount);
        dto.setTotalUnwatched(Math.max(0, totalContent - watchedCount));

        long moviesWatched = 0;
        long seriesWatched = 0;
        long specialsWatched = 0;
        long totalTime = 0;

        Map<String, Long> universeCount = new HashMap<>();
        Map<String, Long> sagaCount = new HashMap<>();

        for (WatchHistory wh : histories) {
            Content c = wh.getContent();
            if (c.getRuntimeMinutes() != null) totalTime += c.getRuntimeMinutes();

            if (c.getContentType() == ContentType.MOVIE) moviesWatched++;
            else if (c.getContentType() == ContentType.TV_SERIES || c.getContentType() == ContentType.LIMITED_SERIES) seriesWatched++;
            else specialsWatched++;

            if (c.getUniverse() != null) {
                universeCount.put(c.getUniverse().getName(), universeCount.getOrDefault(c.getUniverse().getName(), 0L) + 1);
            }
            if (c.getSaga() != null) {
                sagaCount.put(c.getSaga().getName(), sagaCount.getOrDefault(c.getSaga().getName(), 0L) + 1);
            }
        }

        dto.setMoviesWatched(moviesWatched);
        dto.setSeriesWatched(seriesWatched);
        dto.setSpecialsWatched(specialsWatched);
        dto.setEpisodesWatched(episodeProgressRepository.countWatchedEpisodesByUserId(userId));
        dto.setTotalWatchTimeMinutes(totalTime);

        if (totalContent > 0) {
            dto.setOverallCompletionPercentage(Math.round(((double) watchedCount / totalContent) * 1000.0) / 10.0);
        } else {
            dto.setOverallCompletionPercentage(0.0);
        }

        // Favorites
        universeCount.entrySet().stream().max(Map.Entry.comparingByValue()).ifPresent(e -> dto.setFavoriteUniverse(e.getKey()));
        sagaCount.entrySet().stream().max(Map.Entry.comparingByValue()).ifPresent(e -> dto.setFavoriteSaga(e.getKey()));

        // Completion by Saga
        List<Saga> allSagas = sagaRepository.findAll();
        for (Saga s : allSagas) {
            long totalInSaga = contentRepository.countBySagaId(s.getId());
            if (totalInSaga > 0) {
                long watchedInSaga = histories.stream().filter(wh -> wh.getContent().getSaga() != null && wh.getContent().getSaga().getId().equals(s.getId())).count();
                double pct = Math.round(((double) watchedInSaga / totalInSaga) * 1000.0) / 10.0;
                dto.getCompletionBySaga().put(s.getName(), pct);
            }
        }

        // Completion by Universe
        List<Universe> allUniverses = universeRepository.findAll();
        for (Universe u : allUniverses) {
            long totalInUni = contentRepository.countByUniverseId(u.getId());
            if (totalInUni > 0) {
                long watchedInUni = histories.stream().filter(wh -> wh.getContent().getUniverse() != null && wh.getContent().getUniverse().getId().equals(u.getId())).count();
                double pct = Math.round(((double) watchedInUni / totalInUni) * 1000.0) / 10.0;
                dto.getCompletionByUniverse().put(u.getName(), pct);
            }
        }

        return dto;
    }

    private WatchlistDto toWatchlistDto(Watchlist w) {
        WatchlistDto dto = new WatchlistDto();
        dto.setId(w.getId());
        dto.setContentId(w.getContent().getId());
        dto.setContentTitle(w.getContent().getTitle());
        dto.setContentSlug(w.getContent().getSlug());
        dto.setContentType(w.getContent().getContentType().name());
        dto.setContentReleaseYear(w.getContent().getReleaseYear());
        dto.setContentPosterUrl(w.getContent().getPosterUrl());
        if (w.getContent().getUniverse() != null) dto.setUniverseName(w.getContent().getUniverse().getName());
        if (w.getContent().getSaga() != null) dto.setSagaName(w.getContent().getSaga().getName());
        dto.setStatus(w.getStatus());
        dto.setUserRating(w.getUserRating());
        dto.setNotes(w.getNotes());
        dto.setUpdatedAt(w.getUpdatedAt());
        return dto;
    }

    private Map<Long, WatchlistStatus> getWatchlistMap(Long userId) {
        List<Watchlist> list = watchlistRepository.findByUserId(userId);
        Map<Long, WatchlistStatus> map = new HashMap<>();
        for (var w : list) map.put(w.getContent().getId(), w.getStatus());
        return map;
    }
}
