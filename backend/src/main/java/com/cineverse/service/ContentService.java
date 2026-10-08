package com.cineverse.service;

import com.cineverse.dto.*;
import com.cineverse.exception.ResourceNotFoundException;
import com.cineverse.model.entity.*;
import com.cineverse.model.enums.ContentStatus;
import com.cineverse.model.enums.ContentType;
import com.cineverse.model.enums.WatchlistStatus;
import com.cineverse.repository.*;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ContentService {

    private final ContentRepository contentRepository;
    private final ContentRelationshipRepository relationshipRepository;
    private final SeasonRepository seasonRepository;
    private final EpisodeRepository episodeRepository;
    private final PlatformAvailabilityRepository platformAvailabilityRepository;
    private final WatchHistoryRepository watchHistoryRepository;
    private final WatchlistRepository watchlistRepository;
    private final EpisodeProgressRepository episodeProgressRepository;

    public ContentService(ContentRepository contentRepository,
                          ContentRelationshipRepository relationshipRepository,
                          SeasonRepository seasonRepository,
                          EpisodeRepository episodeRepository,
                          PlatformAvailabilityRepository platformAvailabilityRepository,
                          WatchHistoryRepository watchHistoryRepository,
                          WatchlistRepository watchlistRepository,
                          EpisodeProgressRepository episodeProgressRepository) {
        this.contentRepository = contentRepository;
        this.relationshipRepository = relationshipRepository;
        this.seasonRepository = seasonRepository;
        this.episodeRepository = episodeRepository;
        this.platformAvailabilityRepository = platformAvailabilityRepository;
        this.watchHistoryRepository = watchHistoryRepository;
        this.watchlistRepository = watchlistRepository;
        this.episodeProgressRepository = episodeProgressRepository;
    }

    @Transactional(readOnly = true)
    public Page<ContentSummaryDto> getFilteredContent(
            Long franchiseId,
            Long universeId,
            Long timelineId,
            Long sagaId,
            Long phaseId,
            ContentType contentType,
            ContentStatus status,
            Integer releaseYear,
            String search,
            Long currentUserId,
            Pageable pageable) {

        Specification<Content> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.isTrue(root.get("isPublished")));

            if (franchiseId != null) {
                predicates.add(cb.equal(root.get("franchise").get("id"), franchiseId));
            }
            if (universeId != null) {
                predicates.add(cb.equal(root.get("universe").get("id"), universeId));
            }
            if (timelineId != null) {
                predicates.add(cb.equal(root.get("timeline").get("id"), timelineId));
            }
            if (sagaId != null) {
                predicates.add(cb.equal(root.get("saga").get("id"), sagaId));
            }
            if (phaseId != null) {
                predicates.add(cb.equal(root.get("phase").get("id"), phaseId));
            }
            if (contentType != null) {
                predicates.add(cb.equal(root.get("contentType"), contentType));
            }
            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }
            if (releaseYear != null) {
                predicates.add(cb.equal(root.get("releaseYear"), releaseYear));
            }
            if (search != null && !search.trim().isEmpty()) {
                String pattern = "%" + search.toLowerCase().trim() + "%";
                Predicate titleMatch = cb.like(cb.lower(root.get("title")), pattern);
                Predicate castMatch = cb.like(cb.lower(root.get("castMembers")), pattern);
                Predicate directorMatch = cb.like(cb.lower(root.get("director")), pattern);
                Predicate synMatch = cb.like(cb.lower(root.get("shortSynopsis")), pattern);
                Predicate slugMatch = cb.like(cb.lower(root.get("slug")), pattern);
                predicates.add(cb.or(titleMatch, castMatch, directorMatch, synMatch, slugMatch));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Set<Long> watchedIds = getWatchedIdsForUser(currentUserId);
        Map<Long, WatchlistStatus> watchlistStatusMap = getWatchlistMapForUser(currentUserId);

        return contentRepository.findAll(spec, pageable)
                .map(content -> toSummaryDto(content, watchedIds, watchlistStatusMap));
    }

    @Transactional(readOnly = true)
    public ContentDetailDto getContentDetail(String slugOrId, Long currentUserId) {
        Content content;
        try {
            Long id = Long.parseLong(slugOrId);
            content = contentRepository.findById(id)
                    .orElseGet(() -> contentRepository.findBySlug(slugOrId)
                            .orElseThrow(() -> new ResourceNotFoundException("Content not found: " + slugOrId)));
        } catch (NumberFormatException e) {
            content = contentRepository.findBySlug(slugOrId)
                    .orElseThrow(() -> new ResourceNotFoundException("Content not found: " + slugOrId));
        }

        Set<Long> watchedIds = getWatchedIdsForUser(currentUserId);
        Set<Long> watchedEpisodeIds = getWatchedEpisodeIdsForUser(currentUserId);

        ContentDetailDto dto = new ContentDetailDto();
        dto.setId(content.getId());
        dto.setTitle(content.getTitle());
        dto.setOriginalTitle(content.getOriginalTitle());
        dto.setSlug(content.getSlug());
        dto.setContentType(content.getContentType());
        ContentStatus effectiveStatus = content.getStatus();
        if (content.getReleaseDate() != null && !content.getReleaseDate().isAfter(LocalDate.now())
                && effectiveStatus != ContentStatus.CANCELLED) {
            effectiveStatus = ContentStatus.RELEASED;
        }
        dto.setStatus(effectiveStatus);
        dto.setReleaseDate(content.getReleaseDate());
        dto.setReleaseYear(content.getReleaseYear());
        dto.setRuntimeMinutes(content.getRuntimeMinutes());
        dto.setRating(content.getRating());
        dto.setGenres(content.getGenres());
        dto.setShortSynopsis(content.getShortSynopsis());
        dto.setFullSynopsis(content.getFullSynopsis());
        dto.setHasSpoilers(content.getHasSpoilers());
        dto.setPostCreditScene(content.getPostCreditScene());
        dto.setDirector(content.getDirector());
        dto.setWriters(content.getWriters());
        dto.setCastMembers(content.getCastMembers());
        dto.setProductionStudio(content.getProductionStudio());
        dto.setPosterUrl(content.getPosterUrl());
        dto.setBackdropUrl(content.getBackdropUrl());
        dto.setTrailerUrl(content.getTrailerUrl());
        dto.setOfficialWebsiteUrl(content.getOfficialWebsiteUrl());

        dto.setReleaseOrderNum(content.getReleaseOrderNum());
        dto.setChronologicalOrderNum(content.getChronologicalOrderNum());
        dto.setTimelineOrderNum(content.getTimelineOrderNum());

        // "Where Does This Fit?"
        String franchiseName = content.getFranchise() != null ? content.getFranchise().getName() : "N/A";
        String universeName = content.getUniverse() != null ? content.getUniverse().getName() : "N/A";
        String universeDesig = content.getUniverse() != null ? content.getUniverse().getDesignation() : null;
        String timelineName = content.getTimeline() != null ? content.getTimeline().getName() : "N/A";
        Boolean isMainTl = content.getTimeline() != null ? content.getTimeline().getIsMainTimeline() : false;
        String sagaName = content.getSaga() != null ? content.getSaga().getName() : "N/A";
        String phaseName = content.getPhase() != null ? content.getPhase().getName() : "N/A";

        String explanation = buildContextExplanation(content);
        dto.setWhereDoesThisFit(new WhereDoesThisFitDto(
                franchiseName, universeName, universeDesig,
                timelineName, isMainTl, sagaName, phaseName,
                content.getReleaseOrderNum(), content.getChronologicalOrderNum(), content.getTimelineOrderNum(),
                explanation
        ));

        // "Watch Before" (Prerequisites)
        List<ContentRelationship> beforeRels = relationshipRepository.findWatchBeforeByContentId(content.getId());
        dto.setWatchBefore(beforeRels.stream().map(r -> toRelationshipDto(r, r.getSourceContent(), watchedIds)).collect(Collectors.toList()));

        // "Watch After" (Sequels / Next Watch)
        List<ContentRelationship> afterRels = relationshipRepository.findWatchAfterByContentId(content.getId());
        dto.setWatchAfter(afterRels.stream().map(r -> toRelationshipDto(r, r.getTargetContent(), watchedIds)).collect(Collectors.toList()));

        // Related
        final Content targetContent = content;
        List<ContentRelationship> allRels = relationshipRepository.findAllRelationshipsByContentId(targetContent.getId());
        dto.setRelatedContent(allRels.stream()
                .filter(r -> !beforeRels.contains(r) && !afterRels.contains(r))
                .map(r -> {
                    Content other = r.getSourceContent().getId().equals(targetContent.getId()) ? r.getTargetContent() : r.getSourceContent();
                    return toRelationshipDto(r, other, watchedIds);
                }).collect(Collectors.toList()));

        // Seasons & Episodes
        List<Season> seasons = seasonRepository.findByContentIdOrderBySeasonNumberAsc(content.getId());
        int totalEpisodes = 0;
        int watchedEpCount = 0;
        List<SeasonDto> seasonDtos = new ArrayList<>();
        for (Season s : seasons) {
            SeasonDto sDto = new SeasonDto();
            sDto.setId(s.getId());
            sDto.setContentId(content.getId());
            sDto.setSeasonNumber(s.getSeasonNumber());
            sDto.setTitle(s.getTitle());
            sDto.setEpisodeCount(s.getEpisodeCount());
            sDto.setReleaseYear(s.getReleaseYear());
            sDto.setPosterUrl(s.getPosterUrl());

            List<Episode> episodes = episodeRepository.findBySeasonIdOrderByEpisodeNumberAsc(s.getId());
            int seasonWatched = 0;
            List<EpisodeDto> epDtos = new ArrayList<>();
            for (Episode ep : episodes) {
                totalEpisodes++;
                boolean isEpWatched = watchedEpisodeIds.contains(ep.getId());
                if (isEpWatched) {
                    seasonWatched++;
                    watchedEpCount++;
                }
                EpisodeDto epDto = new EpisodeDto();
                epDto.setId(ep.getId());
                epDto.setSeasonId(s.getId());
                epDto.setEpisodeNumber(ep.getEpisodeNumber());
                epDto.setTitle(ep.getTitle());
                epDto.setRuntimeMinutes(ep.getRuntimeMinutes());
                epDto.setReleaseDate(ep.getReleaseDate());
                epDto.setSynopsis(ep.getSynopsis());
                epDto.setStillUrl(ep.getStillUrl());
                epDto.setIsWatched(isEpWatched);
                epDtos.add(epDto);
            }
            sDto.setEpisodes(epDtos);
            sDto.setWatchedEpisodeCount(seasonWatched);
            seasonDtos.add(sDto);
        }
        dto.setSeasons(seasonDtos);

        if (totalEpisodes > 0) {
            dto.setSeriesProgressPercentage((int) Math.round(((double) watchedEpCount / totalEpisodes) * 100));
        }

        // Streaming Availability
        List<PlatformAvailability> platforms = platformAvailabilityRepository.findByContentId(content.getId());
        dto.setStreamingPlatforms(platforms.stream().map(this::toAvailabilityDto).collect(Collectors.toList()));

        // User watch info
        if (currentUserId != null) {
            dto.setIsWatched(watchedIds.contains(content.getId()));
            watchHistoryRepository.findByUserIdAndContentId(currentUserId, content.getId())
                    .ifPresent(wh -> dto.setWatchedAt(wh.getWatchedAt()));

            watchlistRepository.findByUserIdAndContentId(currentUserId, content.getId()).ifPresent(wl -> {
                dto.setIsInWatchlist(true);
                dto.setWatchlistStatus(wl.getStatus().name());
                dto.setUserRating(wl.getUserRating());
                dto.setUserNotes(wl.getNotes());
            });
        }

        return dto;
    }

    @Transactional(readOnly = true)
    public List<ContentSummaryDto> getUpcomingContent(int limit, Long currentUserId) {
        Set<Long> watchedIds = getWatchedIdsForUser(currentUserId);
        Map<Long, WatchlistStatus> watchlistMap = getWatchlistMapForUser(currentUserId);
        return contentRepository.findUpcomingContent(PageRequest.of(0, limit))
                .stream().map(c -> toSummaryDto(c, watchedIds, watchlistMap)).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<ContentSummaryDto> search(String keyword, Long currentUserId, Pageable pageable) {
        Set<Long> watchedIds = getWatchedIdsForUser(currentUserId);
        Map<Long, WatchlistStatus> watchlistMap = getWatchlistMapForUser(currentUserId);
        return contentRepository.searchByKeyword(keyword, pageable)
                .map(c -> toSummaryDto(c, watchedIds, watchlistMap));
    }

    private String buildContextExplanation(Content c) {
        StringBuilder sb = new StringBuilder();
        if (c.getUniverse() != null) {
            sb.append("Part of the ").append(c.getUniverse().getName());
            if (c.getUniverse().getDesignation() != null) {
                sb.append(" (").append(c.getUniverse().getDesignation()).append(")");
            }
            sb.append(". ");
        }
        if (c.getTimeline() != null) {
            if (Boolean.TRUE.equals(c.getTimeline().getIsMainTimeline())) {
                sb.append("Takes place on the Sacred / Primary canon timeline. ");
            } else {
                sb.append("Takes place on the '").append(c.getTimeline().getName()).append("' branch timeline. ");
            }
        }
        if (c.getSaga() != null) {
            sb.append("Belongs to ").append(c.getSaga().getName());
            if (c.getPhase() != null) {
                sb.append(" during ").append(c.getPhase().getName());
            }
            sb.append(". ");
        }
        if (c.getChronologicalOrderNum() != null) {
            sb.append("Story-chronology order position: #").append(c.getChronologicalOrderNum()).append(". ");
        }
        if (c.getReleaseOrderNum() != null) {
            sb.append("Theatrical release order: #").append(c.getReleaseOrderNum()).append(".");
        }
        return sb.toString();
    }

    public ContentSummaryDto toSummaryDto(Content c, Set<Long> watchedIds, Map<Long, WatchlistStatus> watchlistMap) {
        ContentSummaryDto dto = new ContentSummaryDto();
        dto.setId(c.getId());
        dto.setTitle(c.getTitle());
        dto.setOriginalTitle(c.getOriginalTitle());
        dto.setSlug(c.getSlug());
        dto.setContentType(c.getContentType());
        ContentStatus effectiveStatus = c.getStatus();
        if (c.getReleaseDate() != null && !c.getReleaseDate().isAfter(LocalDate.now())
                && effectiveStatus != ContentStatus.CANCELLED) {
            effectiveStatus = ContentStatus.RELEASED;
        }
        dto.setStatus(effectiveStatus);
        dto.setReleaseDate(c.getReleaseDate());
        dto.setReleaseYear(c.getReleaseYear());
        dto.setRuntimeMinutes(c.getRuntimeMinutes());
        dto.setRating(c.getRating());
        dto.setGenres(c.getGenres());
        dto.setShortSynopsis(c.getShortSynopsis());
        dto.setPosterUrl(c.getPosterUrl());
        dto.setBackdropUrl(c.getBackdropUrl());

        dto.setReleaseOrderNum(c.getReleaseOrderNum());
        dto.setChronologicalOrderNum(c.getChronologicalOrderNum());
        dto.setTimelineOrderNum(c.getTimelineOrderNum());

        if (c.getFranchise() != null) {
            dto.setFranchiseId(c.getFranchise().getId());
            dto.setFranchiseName(c.getFranchise().getName());
            dto.setFranchiseSlug(c.getFranchise().getSlug());
        }
        if (c.getUniverse() != null) {
            dto.setUniverseId(c.getUniverse().getId());
            dto.setUniverseName(c.getUniverse().getName());
            dto.setUniverseSlug(c.getUniverse().getSlug());
            dto.setUniverseDesignation(c.getUniverse().getDesignation());
        }
        if (c.getTimeline() != null) {
            dto.setTimelineId(c.getTimeline().getId());
            dto.setTimelineName(c.getTimeline().getName());
            dto.setTimelineSlug(c.getTimeline().getSlug());
            dto.setIsMainTimeline(c.getTimeline().getIsMainTimeline());
        }
        if (c.getSaga() != null) {
            dto.setSagaId(c.getSaga().getId());
            dto.setSagaName(c.getSaga().getName());
            dto.setSagaSlug(c.getSaga().getSlug());
        }
        if (c.getPhase() != null) {
            dto.setPhaseId(c.getPhase().getId());
            dto.setPhaseName(c.getPhase().getName());
            dto.setPhaseNumber(c.getPhase().getPhaseNumber());
        }

        if (watchedIds != null && watchedIds.contains(c.getId())) {
            dto.setIsWatched(true);
        }
        if (watchlistMap != null && watchlistMap.containsKey(c.getId())) {
            dto.setIsInWatchlist(true);
            dto.setWatchlistStatus(watchlistMap.get(c.getId()).name());
        }

        return dto;
    }

    private ContentRelationshipDto toRelationshipDto(ContentRelationship r, Content target, Set<Long> watchedIds) {
        ContentRelationshipDto dto = new ContentRelationshipDto();
        dto.setId(r.getId());
        dto.setRelatedContentId(target.getId());
        dto.setRelatedContentTitle(target.getTitle());
        dto.setRelatedContentSlug(target.getSlug());
        dto.setRelatedContentType(target.getContentType().name());
        dto.setRelatedContentReleaseYear(target.getReleaseYear());
        dto.setRelatedContentPosterUrl(target.getPosterUrl());
        dto.setRelationshipType(r.getRelationshipType());
        dto.setNotes(r.getNotes());
        dto.setIsWatched(watchedIds != null && watchedIds.contains(target.getId()));
        return dto;
    }

    private PlatformAvailabilityDto toAvailabilityDto(PlatformAvailability pa) {
        PlatformAvailabilityDto dto = new PlatformAvailabilityDto();
        dto.setId(pa.getId());
        dto.setPlatformId(pa.getPlatform().getId());
        dto.setPlatformName(pa.getPlatform().getName());
        dto.setPlatformSlug(pa.getPlatform().getSlug());
        dto.setPlatformLogoUrl(pa.getPlatform().getLogoUrl());
        dto.setPlatformBrandColor(pa.getPlatform().getBrandColor());
        dto.setCountryCode(pa.getCountryCode());
        dto.setUrl(pa.getUrl());
        dto.setIsFreeWithSub(pa.getIsFreeWithSub());
        dto.setQuality(pa.getQuality());
        return dto;
    }

    private Set<Long> getWatchedIdsForUser(Long userId) {
        if (userId == null) return Collections.emptySet();
        return new HashSet<>(watchHistoryRepository.findWatchedContentIdsByUserId(userId));
    }

    private Map<Long, WatchlistStatus> getWatchlistMapForUser(Long userId) {
        if (userId == null) return Collections.emptyMap();
        List<Watchlist> list = watchlistRepository.findByUserId(userId);
        Map<Long, WatchlistStatus> map = new HashMap<>();
        for (Watchlist w : list) {
            map.put(w.getContent().getId(), w.getStatus());
        }
        return map;
    }

    private Set<Long> getWatchedEpisodeIdsForUser(Long userId) {
        if (userId == null) return Collections.emptySet();
        return new HashSet<>(episodeProgressRepository.findWatchedEpisodeIdsByUserId(userId));
    }

    @Transactional(readOnly = true)
    public MovieRoadmapDto getMovieRoadmap(String slugOrId, Long currentUserId) {
        Content target;
        try {
            Long id = Long.parseLong(slugOrId);
            target = contentRepository.findById(id)
                    .orElseGet(() -> contentRepository.findBySlug(slugOrId)
                            .orElseThrow(() -> new ResourceNotFoundException("Content not found: " + slugOrId)));
        } catch (NumberFormatException e) {
            target = contentRepository.findBySlug(slugOrId)
                    .orElseGet(() -> {
                        List<Content> matches = contentRepository.findByTitleContainingIgnoreCase(slugOrId);
                        if (!matches.isEmpty()) return matches.get(0);
                        throw new ResourceNotFoundException("Content not found: " + slugOrId);
                    });
        }

        Set<Long> watchedIds = getWatchedIdsForUser(currentUserId);
        Map<Long, WatchlistStatus> watchlistMap = getWatchlistMapForUser(currentUserId);
        ContentSummaryDto targetSummary = toSummaryDto(target, watchedIds, watchlistMap);

        List<RoadmapStepDto> steps;
        String slug = target.getSlug().toLowerCase();
        String title = target.getTitle().toLowerCase();

        boolean isMutant = (target.getUniverse() != null && "x-men-universe".equals(target.getUniverse().getSlug()))
                || slug.contains("x-men") || slug.contains("wolverine") || slug.contains("deadpool") || slug.contains("logan")
                || slug.contains("phoenix") || slug.contains("mutant");

        boolean isSpider = slug.contains("spider-man") || title.contains("spider-man") || slug.contains("venom");

        boolean isAvengers = slug.contains("secret-wars") || slug.contains("doomsday") || title.contains("avengers") || slug.contains("fantastic-four");

        boolean isCaptainAmerica = slug.contains("captain-america") || slug.contains("falcon-and-the-winter-soldier") || slug.contains("thunderbolts");

        boolean isGuardians = slug.contains("guardians-of-the-galaxy");

        boolean isThor = slug.contains("thor");

        boolean isAntMan = slug.contains("ant-man");

        boolean isSupernatural = slug.contains("ghost-rider") || slug.contains("werewolf") || title.contains("ghost rider") || slug.contains("blade");

        boolean isWakanda = slug.contains("black-panther") || title.contains("black panther") || slug.contains("wakanda") || slug.contains("ironheart");

        if (isSpider) {
            steps = buildSpiderManRoadmap(target, watchedIds);
        } else if (isAvengers) {
            steps = buildAvengersRoadmap(target, watchedIds);
        } else if (isMutant) {
            steps = buildMutantRoadmap(target, watchedIds);
        } else if (isCaptainAmerica) {
            steps = buildCaptainAmericaRoadmap(target, watchedIds);
        } else if (isGuardians) {
            steps = buildGuardiansRoadmap(target, watchedIds);
        } else if (isThor) {
            steps = buildThorRoadmap(target, watchedIds);
        } else if (isAntMan) {
            steps = buildAntManRoadmap(target, watchedIds);
        } else if (isSupernatural) {
            steps = buildSupernaturalRoadmap(target, watchedIds);
        } else if (isWakanda) {
            steps = buildWakandaRoadmap(target, watchedIds);
        } else {
            steps = buildGenericRoadmap(target, watchedIds);
        }

        // Renumber 1..N and compute statistics
        int totalRuntime = 0;
        int watchedSteps = 0;
        for (int i = 0; i < steps.size(); i++) {
            RoadmapStepDto step = steps.get(i);
            step.setStepNumber(i + 1);
            if (step.getRuntimeMinutes() != null) {
                totalRuntime += step.getRuntimeMinutes();
            }
            if (Boolean.TRUE.equals(step.getIsWatched())) {
                watchedSteps++;
            }
        }

        MovieRoadmapDto roadmap = new MovieRoadmapDto();
        roadmap.setTargetMovie(targetSummary);
        roadmap.setSteps(steps);
        roadmap.setTotalSteps(steps.size());
        roadmap.setTotalWatchTimeMinutes(totalRuntime);
        roadmap.setTotalWatchedSteps(watchedSteps);
        roadmap.setCompletionPercentage(steps.isEmpty() ? 0 : Math.round((float) watchedSteps / steps.size() * 100));
        roadmap.setRoadmapType("CANONICAL_STORYLINE_ROADMAP");
        roadmap.setNarrativeSummary("Complete chronological roadmap from scratch (#1 origin) directly leading into " + target.getTitle() + ", detailing multiverse origins, timeline placement, and why each chapter is necessary to watch.");

        return roadmap;
    }

    private List<RoadmapStepDto> buildSpiderManRoadmap(Content target, Set<Long> watchedIds) {
        List<RoadmapStepDto> list = new ArrayList<>();
        addStepIfPresent(list, "spider-man-2002", "CORE_ORIGIN",
                "Origin of Peter Parker in Earth-96283. Establishes Norman Osborn as the Green Goblin, Uncle Ben's death, and the core 'With great power comes great responsibility' motto.",
                "Tobey Maguire (Peter Parker), Willem Dafoe (Norman Osborn)", watchedIds);

        addStepIfPresent(list, "spider-man-2-2004", "ESSENTIAL_LORE",
                "Establishes Otto Octavius (Doc Ock), his fusion energy project, mechanical tentacles, and the tragic price of being Spider-Man.",
                "Tobey Maguire, Alfred Molina (Doc Ock)", watchedIds);

        addStepIfPresent(list, "spider-man-3-2007", "MULTIVERSE_BRIDGE",
                "Introduces Flint Marko (Sandman), particle physics accident, and Symbiote suit lore in Earth-96283.",
                "Tobey Maguire, Thomas Haden Church (Sandman)", watchedIds);

        addStepIfPresent(list, "the-amazing-spider-man-2012", "CORE_ORIGIN",
                "Alternate universe origin (Earth-120703). Dr. Curt Connors reptilian regeneration experiment creates The Lizard.",
                "Andrew Garfield (Peter Parker), Rhys Ifans (The Lizard)", watchedIds);

        addStepIfPresent(list, "the-amazing-spider-man-2-2014", "ESSENTIAL_LORE",
                "Max Dillon electrical grid accident creates Electro. Tragic clocktower fall of Gwen Stacy that haunts Andrew's Peter.",
                "Andrew Garfield, Jamie Foxx (Electro), Emma Stone", watchedIds);

        addStepIfPresent(list, "captain-america-civil-war", "CORE_ORIGIN",
                "First appearance of Tom Holland's Spider-Man in Earth-616. Recruited by Tony Stark for the Leipzig airport battle.",
                "Tom Holland (Spider-Man), Robert Downey Jr. (Tony Stark)", watchedIds);

        addStepIfPresent(list, "spider-man-homecoming", "ESSENTIAL_LORE",
                "Peter's solo journey in the MCU. Battles Adrian Toomes (The Vulture) and chooses street-level heroism over Stark glory.",
                "Tom Holland, Michael Keaton (Vulture), Zendaya", watchedIds);

        addStepIfPresent(list, "avengers-infinity-war", "CRITICAL_MUST_WATCH",
                "Peter joins Iron Man and Doctor Strange in space against Thanos on Titan, experiencing the cosmic battlefield and the Blip.",
                "Tom Holland, Robert Downey Jr., Benedict Cumberbatch", watchedIds);

        addStepIfPresent(list, "avengers-endgame", "CRITICAL_MUST_WATCH",
                "Peter returns in the final battle for Earth, witnessing Tony Stark's ultimate sacrifice.",
                "Tom Holland, Robert Downey Jr.", watchedIds);

        addStepIfPresent(list, "spider-man-far-from-home", "CRITICAL_MUST_WATCH",
                "Mysterio deceives Peter with illusion technology and posthumously exposes Peter Parker's secret identity to the world.",
                "Tom Holland, Jake Gyllenhaal (Mysterio), Zendaya", watchedIds);

        addStepIfPresent(list, "spider-man-no-way-home", "CRITICAL_MUST_WATCH",
                "Multiverse Nexus! Doctor Strange's spell pulls Tobey Maguire, Andrew Garfield, Green Goblin, Doc Ock, Sandman, Lizard, and Electro into Earth-616. To seal the tear, everyone forgets Peter Parker.",
                "Tom Holland, Tobey Maguire, Andrew Garfield, Willem Dafoe", watchedIds);

        if ("spider-man-brand-new-day".equals(target.getSlug())) {
            list.add(toRoadmapStep(target, "TARGET_DESTINATION",
                    "Target Film! Peter Parker lives alone in a humble NYC apartment with no memories of his past existence. Returns to raw, homemade-suit street-level heroism against Kingpin's city syndicate.",
                    target.getCastMembers(), watchedIds));
        } else {
            trimOrAppendTarget(list, target, watchedIds);
        }

        return list;
    }

    private List<RoadmapStepDto> buildAvengersRoadmap(Content target, Set<Long> watchedIds) {
        List<RoadmapStepDto> list = new ArrayList<>();
        addStepIfPresent(list, "captain-america-the-first-avenger", "CORE_ORIGIN",
                "The chronological beginning of the MCU. Steve Rogers becomes Captain America; introduces the Space Stone (Tesseract) and Hydra.",
                "Chris Evans, Hugo Weaving", watchedIds);

        addStepIfPresent(list, "iron-man", "CORE_ORIGIN",
                "Tony Stark builds the Mark I armor and establishes the modern MCU and the Avengers Initiative.",
                "Robert Downey Jr., Samuel L. Jackson", watchedIds);

        addStepIfPresent(list, "the-avengers", "ESSENTIAL_LORE",
                "Earth's Mightiest Heroes assemble to defeat Loki and the Chitauri in New York; first appearance of Thanos.",
                "Robert Downey Jr., Chris Evans, Chris Hemsworth, Tom Hiddleston", watchedIds);

        addStepIfPresent(list, "captain-america-civil-war", "ESSENTIAL_LORE",
                "The Avengers fracture over the Sokovia Accords; introduces Spider-Man and Black Panther to the MCU.",
                "Chris Evans, Robert Downey Jr., Chadwick Boseman, Tom Holland", watchedIds);

        addStepIfPresent(list, "avengers-infinity-war", "CRITICAL_MUST_WATCH",
                "Thanos gathers all six Infinity Stones and wipes out half of all life in the universe.",
                "Robert Downey Jr., Josh Brolin, Chris Hemsworth", watchedIds);

        addStepIfPresent(list, "avengers-endgame", "CRITICAL_MUST_WATCH",
                "The Time Heist through the Quantum Realm. Tony Stark's sacrifice, Steve Rogers passes the shield, and Loki's 2012 escape.",
                "Robert Downey Jr., Chris Evans, Scarlett Johansson", watchedIds);

        addStepIfPresent(list, "loki", "CRITICAL_MUST_WATCH",
                "The Time Variance Authority, He Who Remains, the Citadel at the End of Time, and Loki weaving the multiverse tree Yggdrasil.",
                "Tom Hiddleston, Owen Wilson, Sophia Di Martino", watchedIds);

        addStepIfPresent(list, "wandavision", "ESSENTIAL_LORE",
                "Wanda Maximoff embraces her destiny as the Scarlet Witch and unlocks the Darkhold.",
                "Elizabeth Olsen, Paul Bettany", watchedIds);

        addStepIfPresent(list, "spider-man-no-way-home", "MULTIVERSE_BRIDGE",
                "First multiversal breach in Earth-616, bringing alternate Spider-Men and legacy villains.",
                "Tom Holland, Tobey Maguire, Andrew Garfield, Benedict Cumberbatch", watchedIds);

        addStepIfPresent(list, "doctor-strange-in-the-multiverse-of-madness", "CRITICAL_MUST_WATCH",
                "Explains universal incursions, dreamwalking, America Chavez's dimension powers, and the Illuminati on Earth-838.",
                "Benedict Cumberbatch, Elizabeth Olsen, Patrick Stewart", watchedIds);

        addStepIfPresent(list, "deadpool-and-wolverine", "MULTIVERSE_BRIDGE",
                "TVA recruitment, anchor beings, the Void at the End of Time, and the fusion of the Fox X-Men legacy with the MCU.",
                "Ryan Reynolds, Hugh Jackman, Dafne Keen", watchedIds);

        addStepIfPresent(list, "the-fantastic-four-first-steps", "ESSENTIAL_LORE",
                "Marvel's First Family from an alternate 1960s retro-future world faces Galactus and bridges into the main MCU conflict.",
                "Pedro Pascal, Vanessa Kirby, Joseph Quinn", watchedIds);

        addStepIfPresent(list, "avengers-doomsday", "CRITICAL_MUST_WATCH",
                "Doctor Victor Von Doom rises as universal incursions trigger reality collapse, setting up Battleworld.",
                "Robert Downey Jr., Pedro Pascal, Benedict Cumberbatch", watchedIds);

        if ("avengers-secret-wars".equals(target.getSlug())) {
            list.add(toRoadmapStep(target, "TARGET_DESTINATION",
                    "Target Culmination! Dec 2027: The ultimate collision of all multiverse realities on Battleworld, uniting champions from all branches.",
                    target.getCastMembers(), watchedIds));
        } else {
            trimOrAppendTarget(list, target, watchedIds);
        }

        return list;
    }

    private List<RoadmapStepDto> buildMutantRoadmap(Content target, Set<Long> watchedIds) {
        List<RoadmapStepDto> list = new ArrayList<>();
        String slug = target.getSlug();

        // 1. Prequel / Revised Timeline Arc
        if (slug.contains("first-class") || slug.contains("days-of-future-past") || slug.contains("apocalypse") || slug.contains("phoenix")) {
            addStepIfPresent(list, "x-men-first-class-2011", "CORE_ORIGIN",
                    "The 1962 origin of Xavier's School and the mutant civil rights ideological divide between Charles Xavier and Erik Lehnsherr.",
                    "James McAvoy, Michael Fassbender, Jennifer Lawrence", watchedIds);
            addStepIfPresent(list, "x-men-days-of-future-past-2014", "ESSENTIAL_LORE",
                    "1973 time travel rewriting history. Wolverine travels back to prevent the Sentinel apocalypse, altering the Fox mutant timeline forever.",
                    "Hugh Jackman, James McAvoy, Michael Fassbender", watchedIds);
            addStepIfPresent(list, "x-men-apocalypse-2016", "ESSENTIAL_LORE",
                    "1983: Ancient mutant En Sabah Nur awakens. The young X-Men assemble, and Jean Grey unleashes her latent Phoenix power.",
                    "James McAvoy, Michael Fassbender, Sophie Turner", watchedIds);
            addStepIfPresent(list, "dark-phoenix-2019", "TARGET_DESTINATION",
                    "1992: Jean Grey absorbs cosmic solar flare energy in space, unleashing the devastating full power of the Phoenix.",
                    "Sophie Turner, James McAvoy, Michael Fassbender", watchedIds);
            trimOrAppendTarget(list, target, watchedIds);
            return list;
        }

        // 2. Original Trilogy & Wolverine Solo Arc
        if (slug.contains("origins-wolverine") || slug.equals("x-men-2000") || slug.contains("x2") || slug.contains("last-stand")
                || slug.contains("the-wolverine") || slug.contains("logan") || slug.contains("new-mutants")) {
            addStepIfPresent(list, "x-men-origins-wolverine-2009", "CORE_ORIGIN",
                    "1845-1979: James Howlett's century-spanning military service and Weapon X adamantium skeletal bonding.",
                    "Hugh Jackman, Liev Schreiber", watchedIds);
            addStepIfPresent(list, "x-men-2000", "CORE_ORIGIN",
                    "The cinematic dawn of mutantkind in Earth-10005. Hugh Jackman's debut as Wolverine, Xavier's School, and Magneto's philosophy.",
                    "Hugh Jackman, Patrick Stewart, Ian McKellen", watchedIds);
            addStepIfPresent(list, "x2-2003", "ESSENTIAL_LORE",
                    "William Stryker attacks Xavier's School; mutants unite, and Jean Grey sacrifices herself at Alkali Lake.",
                    "Hugh Jackman, Patrick Stewart, Famke Janssen", watchedIds);
            addStepIfPresent(list, "x-men-the-last-stand-2006", "ESSENTIAL_LORE",
                    "The mutant cure controversy and the resurrection of Jean Grey as the Dark Phoenix.",
                    "Hugh Jackman, Famke Janssen, Ian McKellen", watchedIds);
            addStepIfPresent(list, "the-wolverine-2013", "ESSENTIAL_LORE",
                    "Haunted by Jean's death, Logan travels to Japan and confronts mortality and the Silver Samurai.",
                    "Hugh Jackman, Hiroyuki Sanada, Rila Fukushima", watchedIds);
            addStepIfPresent(list, "x-men-days-of-future-past-2014", "MULTIVERSE_BRIDGE",
                    "Sentinels drive mutantkind to near extinction; Wolverine's consciousness is sent to 1973 to rewrite destiny.",
                    "Hugh Jackman, Patrick Stewart, Ian McKellen", watchedIds);
            addStepIfPresent(list, "logan-2017", "CRITICAL_MUST_WATCH",
                    "2029: The emotional climax of Hugh Jackman's Wolverine and Laura (X-23). The death of Earth-10005's anchor being.",
                    "Hugh Jackman, Patrick Stewart, Dafne Keen", watchedIds);
            addStepIfPresent(list, "the-new-mutants-2020", "TARGET_DESTINATION",
                    "Essex Corporation / Transigen genetic harvesting continues at Milbury Hospital on young mutant survivors.",
                    "Anya Taylor-Joy, Maisie Williams, Charlie Heaton", watchedIds);
            trimOrAppendTarget(list, target, watchedIds);
            return list;
        }

        // 3. Deadpool Solos
        if (slug.equals("deadpool-2016") || slug.equals("deadpool-2-2018")) {
            addStepIfPresent(list, "x-men-2000", "CORE_ORIGIN",
                    "Establishes Xavier's School, Colossus, and the Earth-10005 mutant world.",
                    "Hugh Jackman, Patrick Stewart", watchedIds);
            addStepIfPresent(list, "deadpool-2016", "CORE_ORIGIN",
                    "Wade Wilson undergoes Weapon X-style mutation and becomes Deadpool.",
                    "Ryan Reynolds, Morena Baccarin", watchedIds);
            addStepIfPresent(list, "deadpool-2-2018", "TARGET_DESTINATION",
                    "Wade forms X-Force, encounters Cable from the future, and acquires a temporal device.",
                    "Ryan Reynolds, Josh Brolin", watchedIds);
            trimOrAppendTarget(list, target, watchedIds);
            return list;
        }

        // 4. Deadpool & Wolverine Multiverse Nexus
        if (slug.contains("deadpool-and-wolverine")) {
            addStepIfPresent(list, "x-men-2000", "CORE_ORIGIN",
                    "The cinematic debut of Wolverine and the foundation of Earth-10005.",
                    "Hugh Jackman, Patrick Stewart", watchedIds);
            addStepIfPresent(list, "deadpool-2016", "ESSENTIAL_LORE",
                    "Deadpool's origin in the Fox mutant universe.",
                    "Ryan Reynolds, Morena Baccarin", watchedIds);
            addStepIfPresent(list, "deadpool-2-2018", "ESSENTIAL_LORE",
                    "Wade's time travel device usage that attracts TVA surveillance.",
                    "Ryan Reynolds, Josh Brolin", watchedIds);
            addStepIfPresent(list, "logan-2017", "CRITICAL_MUST_WATCH",
                    "The death of Wolverine as Earth-10005's Anchor Being drives the universe toward extinction.",
                    "Hugh Jackman, Dafne Keen", watchedIds);
            addStepIfPresent(list, "loki-season-1", "ESSENTIAL_LORE",
                    "Establishes the TVA, pruning, and the Void at the End of Time guarded by Alioth.",
                    "Tom Hiddleston, Owen Wilson", watchedIds);
            addStepIfPresent(list, "deadpool-and-wolverine", "TARGET_DESTINATION",
                    "Target Film! Deadpool and Wolverine unite across the Void and enter the Marvel Cinematic Universe.",
                    "Ryan Reynolds, Hugh Jackman, Dafne Keen", watchedIds);
            return list;
        }

        // 5. Future MCU X-Men / Secret Wars integration
        addStepIfPresent(list, "x-men-2000", "CORE_ORIGIN",
                "The legacy foundation of mutantkind in live-action cinema.",
                "Hugh Jackman, Patrick Stewart", watchedIds);
        addStepIfPresent(list, "deadpool-and-wolverine", "MULTIVERSE_BRIDGE",
                "Deadpool and Wolverine cross over through the Void into the MCU.",
                "Ryan Reynolds, Hugh Jackman", watchedIds);
        addStepIfPresent(list, "avengers-doomsday", "CRITICAL_MUST_WATCH",
                "Doctor Doom triggers catastrophic incursions, collapsing timelines.",
                "Robert Downey Jr., Pedro Pascal", watchedIds);
        addStepIfPresent(list, "avengers-secret-wars", "CRITICAL_MUST_WATCH",
                "Dec 2027: All multiverse realities merge on Battleworld, joining mutants with the Avengers.",
                "Ensemble Cast", watchedIds);
        addStepIfPresent(list, "x-men-2028", "TARGET_DESTINATION",
                "Target Film! May 2028: Marvel Studios' official feature film debut integrating the mutant species into the MCU.",
                target.getCastMembers(), watchedIds);
        trimOrAppendTarget(list, target, watchedIds);
        return list;
    }

    private List<RoadmapStepDto> buildCaptainAmericaRoadmap(Content target, Set<Long> watchedIds) {
        List<RoadmapStepDto> list = new ArrayList<>();
        addStepIfPresent(list, "captain-america-the-first-avenger", "CORE_ORIGIN",
                "1942: Steve Rogers receives the Super Soldier Serum, battles Red Skull, and becomes Captain America.",
                "Chris Evans, Hugo Weaving, Sebastian Stan", watchedIds);
        addStepIfPresent(list, "the-avengers", "ESSENTIAL_LORE",
                "2012: Steve awakens in modern New York and leads Earth's Mightiest Heroes against Loki.",
                "Chris Evans, Robert Downey Jr.", watchedIds);
        addStepIfPresent(list, "captain-america-the-winter-soldier", "ESSENTIAL_LORE",
                "2014: Hydra's infiltration of S.H.I.E.L.D. revealed. Sam Wilson introduced as Falcon; Bucky returns as the Winter Soldier.",
                "Chris Evans, Anthony Mackie, Sebastian Stan, Scarlett Johansson", watchedIds);
        addStepIfPresent(list, "captain-america-civil-war", "ESSENTIAL_LORE",
                "2016: The Sokovia Accords fracture the Avengers. Sam Wilson stands loyally by Steve Rogers.",
                "Chris Evans, Robert Downey Jr., Anthony Mackie, Sebastian Stan", watchedIds);
        addStepIfPresent(list, "avengers-endgame", "CRITICAL_MUST_WATCH",
                "2023: Steve Rogers retires in the past and officially passes the vibranium shield to Sam Wilson.",
                "Chris Evans, Anthony Mackie", watchedIds);
        addStepIfPresent(list, "the-falcon-and-the-winter-soldier", "CRITICAL_MUST_WATCH",
                "2024: Sam Wilson wrestles with the legacy of the shield, defeats the Flag Smashers, and accepts the mantle of Captain America.",
                "Anthony Mackie, Sebastian Stan, Wyatt Russell", watchedIds);
        addStepIfPresent(list, "captain-america-brave-new-world", "TARGET_DESTINATION",
                "Target Film! Sam Wilson is summoned to the White House by President Thaddeus Ross, battling international conspiracies and the Red Hulk.",
                "Anthony Mackie, Harrison Ford, Giancarlo Esposito", watchedIds);
        addStepIfPresent(list, "thunderbolts", "NEXT_WATCH",
                "The covert operative counterpart to Brave New World, bringing Bucky Barnes, Yelena Belova, and U.S. Agent together.",
                "Florence Pugh, Sebastian Stan, David Harbour", watchedIds);
        trimOrAppendTarget(list, target, watchedIds);
        return list;
    }

    private List<RoadmapStepDto> buildGuardiansRoadmap(Content target, Set<Long> watchedIds) {
        List<RoadmapStepDto> list = new ArrayList<>();
        addStepIfPresent(list, "guardians-of-the-galaxy", "CORE_ORIGIN",
                "2014: Peter Quill, Gamora, Drax, Rocket, and Groot unite on the Kyln and save Xandar from Ronan the Accuser.",
                "Chris Pratt, Zoe Saldana, Dave Bautista, Bradley Cooper, Vin Diesel", watchedIds);
        addStepIfPresent(list, "guardians-of-the-galaxy-vol-2", "ESSENTIAL_LORE",
                "2014: Peter discovers his Celestial father Ego. Mantis joins the team and Yondu makes the ultimate sacrifice.",
                "Chris Pratt, Kurt Russell, Michael Rooker, Pom Klementieff", watchedIds);
        addStepIfPresent(list, "avengers-infinity-war", "CRITICAL_MUST_WATCH",
                "2018: The Guardians cross paths with Thor and confront Thanos on Knowhere and Titan; Gamora is sacrificed for the Soul Stone.",
                "Chris Pratt, Zoe Saldana, Josh Brolin", watchedIds);
        addStepIfPresent(list, "avengers-endgame", "CRITICAL_MUST_WATCH",
                "2023: The battle against 2014 Thanos brings an alternate timeline Gamora to the present; the Guardians help save the cosmos.",
                "Chris Pratt, Zoe Saldana, Bradley Cooper", watchedIds);
        addStepIfPresent(list, "the-guardians-of-the-galaxy-holiday-special", "ESSENTIAL_LORE",
                "2022: Mantis and Drax travel to Earth to give Peter a memorable Christmas, revealing Mantis is Peter's sister.",
                "Pom Klementieff, Dave Bautista, Kevin Bacon", watchedIds);
        addStepIfPresent(list, "guardians-of-the-galaxy-vol-3", "TARGET_DESTINATION",
                "Target Film! The Guardians rally to save Rocket's life, confronting the High Evolutionary in their emotional final mission together.",
                "Chris Pratt, Bradley Cooper, Chukwudi Iwuji, Will Poulter", watchedIds);
        trimOrAppendTarget(list, target, watchedIds);
        return list;
    }

    private List<RoadmapStepDto> buildAntManRoadmap(Content target, Set<Long> watchedIds) {
        List<RoadmapStepDto> list = new ArrayList<>();
        addStepIfPresent(list, "ant-man", "CORE_ORIGIN",
                "2015: Master thief Scott Lang is recruited by Hank Pym to don the Ant-Man suit and master Pym Particles.",
                "Paul Rudd, Michael Douglas, Evangeline Lilly", watchedIds);
        addStepIfPresent(list, "captain-america-civil-war", "ESSENTIAL_LORE",
                "2016: Scott is recruited by Sam Wilson for Team Cap at the Leipzig airport, revealing Giant-Man.",
                "Paul Rudd, Chris Evans", watchedIds);
        addStepIfPresent(list, "ant-man-and-the-wasp", "ESSENTIAL_LORE",
                "2018: Hope van Dyne suits up as the Wasp; the team navigates the Quantum Realm to rescue Janet van Dyne.",
                "Paul Rudd, Evangeline Lilly, Michelle Pfeiffer", watchedIds);
        addStepIfPresent(list, "avengers-endgame", "CRITICAL_MUST_WATCH",
                "2023: Scott escapes the Quantum Realm after 5 hours (5 Earth years) and proposes the Time Heist to the Avengers.",
                "Paul Rudd, Robert Downey Jr.", watchedIds);
        addStepIfPresent(list, "loki-season-1", "MULTIVERSE_BRIDGE",
                "Establishes the Citadel at the End of Time and He Who Remains, warning of Kang variants.",
                "Tom Hiddleston, Jonathan Majors", watchedIds);
        addStepIfPresent(list, "ant-man-and-the-wasp-quantumania", "TARGET_DESTINATION",
                "Target Film! The Ant-Family is pulled into the subatomic Quantum Realm civilization, battling Kang the Conqueror.",
                "Paul Rudd, Evangeline Lilly, Jonathan Majors, Kathryn Newton", watchedIds);
        trimOrAppendTarget(list, target, watchedIds);
        return list;
    }

    private List<RoadmapStepDto> buildThorRoadmap(Content target, Set<Long> watchedIds) {
        List<RoadmapStepDto> list = new ArrayList<>();
        addStepIfPresent(list, "thor", "CORE_ORIGIN",
                "2011: Thor is banished from Asgard to Earth, learns humility, and meets astrophysicist Jane Foster.",
                "Chris Hemsworth, Natalie Portman, Tom Hiddleston", watchedIds);
        addStepIfPresent(list, "the-avengers", "ESSENTIAL_LORE",
                "2012: Thor teams with Earth's heroes to capture his brother Loki in the Battle of New York.",
                "Chris Hemsworth, Tom Hiddleston", watchedIds);
        addStepIfPresent(list, "thor-the-dark-world", "ESSENTIAL_LORE",
                "2013: Malekith and the Dark Elves seek the Aether (Reality Stone), which infects Jane Foster.",
                "Chris Hemsworth, Natalie Portman, Christopher Eccleston", watchedIds);
        addStepIfPresent(list, "avengers-age-of-ultron", "ESSENTIAL_LORE",
                "2015: Thor experiences an apocalyptic vision of the Infinity Stones and Ragnarok at the Water of Sights.",
                "Chris Hemsworth, Mark Ruffalo", watchedIds);
        addStepIfPresent(list, "thor-ragnarok", "ESSENTIAL_LORE",
                "2017: Hela shatters Mjolnir; Thor, Hulk, and Valkyrie team up on Sakaar before Asgard is destroyed.",
                "Chris Hemsworth, Cate Blanchett, Mark Ruffalo, Tessa Thompson", watchedIds);
        addStepIfPresent(list, "avengers-infinity-war", "CRITICAL_MUST_WATCH",
                "2018: Thor forges Stormbreaker on Nidavellir with Eitri and strikes Thanos in Wakanda.",
                "Chris Hemsworth, Josh Brolin", watchedIds);
        addStepIfPresent(list, "avengers-endgame", "CRITICAL_MUST_WATCH",
                "2023: Thor participates in the Time Heist, speaks with his mother Frigga, and passes New Asgard's crown to Valkyrie.",
                "Chris Hemsworth, Rene Russo", watchedIds);
        addStepIfPresent(list, "thor-love-and-thunder", "TARGET_DESTINATION",
                "Target Film! Thor seeks inner peace, reuniting with Jane Foster who wields reformed Mjolnir as the Mighty Thor against Gorr.",
                "Chris Hemsworth, Natalie Portman, Christian Bale", watchedIds);
        trimOrAppendTarget(list, target, watchedIds);
        return list;
    }

    private List<RoadmapStepDto> buildSupernaturalRoadmap(Content target, Set<Long> watchedIds) {
        List<RoadmapStepDto> list = new ArrayList<>();
        addStepIfPresent(list, "werewolf-by-night", "CORE_ORIGIN",
                "Introduces the Bloodstone relic, monster hunters, and the supernatural occult underground of the MCU.",
                "Gael García Bernal, Laura Donnelly", watchedIds);

        addStepIfPresent(list, "doctor-strange-in-the-multiverse-of-madness", "ESSENTIAL_LORE",
                "Explores dark sorcery, the corrupting influence of the Darkhold, and the demonic dimensions.",
                "Benedict Cumberbatch, Elizabeth Olsen", watchedIds);

        addStepIfPresent(list, "avengers-secret-wars", "CRITICAL_MUST_WATCH",
                "Dec 2027: The cosmic reset re-awakens ancient supernatural forces across the unified timeline.",
                "Ensemble Cast", watchedIds);

        if ("ghost-rider-2028".equals(target.getSlug())) {
            list.add(toRoadmapStep(target, "TARGET_DESTINATION",
                    "Target Film! Feb 2028: The Spirit of Vengeance arrives to blaze a hellfire path across the MCU occult underworld.",
                    target.getCastMembers(), watchedIds));
        } else {
            trimOrAppendTarget(list, target, watchedIds);
        }

        return list;
    }

    private List<RoadmapStepDto> buildWakandaRoadmap(Content target, Set<Long> watchedIds) {
        List<RoadmapStepDto> list = new ArrayList<>();
        addStepIfPresent(list, "captain-america-civil-war", "CORE_ORIGIN",
                "T'Chaka's assassination in Vienna; T'Challa dons the Black Panther habit to hunt the Winter Soldier.",
                "Chadwick Boseman, Chris Evans", watchedIds);

        addStepIfPresent(list, "black-panther", "CORE_ORIGIN",
                "T'Challa is crowned King of Wakanda, confronts Killmonger, and reveals Wakanda's vibranium secrets to the world.",
                "Chadwick Boseman, Michael B. Jordan, Letitia Wright", watchedIds);

        addStepIfPresent(list, "avengers-infinity-war", "ESSENTIAL_LORE",
                "Wakanda serves as the frontline defense against Thanos' Outriders; King T'Challa is dusted in the Blip.",
                "Chadwick Boseman, Danai Gurira", watchedIds);

        addStepIfPresent(list, "avengers-endgame", "ESSENTIAL_LORE",
                "T'Challa and the Wakandan army return through the portals in the final battle for Earth.",
                "Chadwick Boseman, Danai Gurira", watchedIds);

        addStepIfPresent(list, "black-panther-wakanda-forever", "CRITICAL_MUST_WATCH",
                "Wakanda mourns King T'Challa. Shuri synthesizes the heart-shaped herb to become Black Panther and negotiates peace with Namor.",
                "Letitia Wright, Tenoch Huerta, Angela Bassett", watchedIds);

        addStepIfPresent(list, "avengers-secret-wars", "CRITICAL_MUST_WATCH",
                "Dec 2027: Wakanda's technology and vibranium defense during the Battleworld multiverse crisis.",
                "Ensemble Cast", watchedIds);

        if ("black-panther-3".equals(target.getSlug())) {
            list.add(toRoadmapStep(target, "TARGET_DESTINATION",
                    "Target Film! Dec 2028: Wakanda's next royal chapter and sovereign geopolitical dominance following Secret Wars.",
                    target.getCastMembers(), watchedIds));
        } else {
            trimOrAppendTarget(list, target, watchedIds);
        }

        return list;
    }

    private List<RoadmapStepDto> buildGenericRoadmap(Content target, Set<Long> watchedIds) {
        List<RoadmapStepDto> list = new ArrayList<>();

        // If target is MCU / Earth-616, start with scratch origin #1: Captain America: The First Avenger or Iron Man
        if (target.getUniverse() != null && "mcu".equals(target.getUniverse().getSlug())) {
            if (!"captain-america-the-first-avenger".equals(target.getSlug()) && !"iron-man".equals(target.getSlug())) {
                if (target.getReleaseYear() != null && target.getReleaseYear() <= 2012) {
                    addStepIfPresent(list, "iron-man", "CORE_ORIGIN",
                            "The modern dawn of Earth-616 and the Avengers Initiative.",
                            "Robert Downey Jr.", watchedIds);
                } else {
                    addStepIfPresent(list, "captain-america-the-first-avenger", "CORE_ORIGIN",
                            "The chronological origin of the Marvel Cinematic Universe (#1 in story chronology).",
                            "Chris Evans, Hugo Weaving", watchedIds);
                    addStepIfPresent(list, "the-avengers", "ESSENTIAL_LORE",
                            "Earth's Mightiest Heroes first assemble to defend Earth.",
                            "Robert Downey Jr., Chris Evans", watchedIds);
                }
            }
        }

        // Fetch direct prerequisites recursively
        List<ContentRelationship> prereqs = relationshipRepository.findWatchBeforeByContentId(target.getId());
        for (ContentRelationship rel : prereqs) {
            Content src = rel.getSourceContent();
            if (src.getId().equals(target.getId())) continue;
            boolean alreadyInList = list.stream().anyMatch(s -> s.getContentId().equals(src.getId()));
            if (!alreadyInList) {
                list.add(toRoadmapStep(src, "PREREQUISITE",
                        rel.getNotes() != null ? rel.getNotes() : "Essential prequel story leading directly into " + target.getTitle(),
                        src.getCastMembers(), watchedIds));
            }
        }

        // Add target
        list.add(toRoadmapStep(target, "TARGET_DESTINATION", "Target project to watch.", target.getCastMembers(), watchedIds));
        return list;
    }

    private void addStepIfPresent(List<RoadmapStepDto> list, String slug, String priority, String reason, String keyCharacters, Set<Long> watchedIds) {
        contentRepository.findBySlug(slug).ifPresent(c -> {
            list.add(toRoadmapStep(c, priority, reason, keyCharacters, watchedIds));
        });
    }

    private void trimOrAppendTarget(List<RoadmapStepDto> list, Content target, Set<Long> watchedIds) {
        // If target is in list, truncate list up to target
        int index = -1;
        for (int i = 0; i < list.size(); i++) {
            if (list.get(i).getContentId().equals(target.getId())) {
                index = i;
                break;
            }
        }
        if (index >= 0) {
            while (list.size() > index + 1) {
                list.remove(list.size() - 1);
            }
            list.get(index).setPriority("TARGET_DESTINATION");
        } else {
            list.add(toRoadmapStep(target, "TARGET_DESTINATION", "Target project to watch.", target.getCastMembers(), watchedIds));
        }
    }

    private RoadmapStepDto toRoadmapStep(Content c, String priority, String reason, String keyCharacters, Set<Long> watchedIds) {
        RoadmapStepDto step = new RoadmapStepDto();
        step.setContentId(c.getId());
        step.setTitle(c.getTitle());
        step.setSlug(c.getSlug());
        step.setReleaseDate(c.getReleaseDate());
        step.setReleaseYear(c.getReleaseYear());
        step.setRuntimeMinutes(c.getRuntimeMinutes());
        step.setContentType(c.getContentType());
        step.setUniverseName(c.getUniverse() != null ? c.getUniverse().getName() : "N/A");
        step.setUniverseDesignation(c.getUniverse() != null ? c.getUniverse().getDesignation() : "");
        step.setTimelineName(c.getTimeline() != null ? c.getTimeline().getName() : "N/A");
        step.setSagaName(c.getSaga() != null ? c.getSaga().getName() : "N/A");
        step.setPhaseName(c.getPhase() != null ? c.getPhase().getName() : "N/A");
        step.setPosterUrl(c.getPosterUrl());
        step.setBackdropUrl(c.getBackdropUrl());
        step.setRating(c.getRating());
        step.setPriority(priority);
        step.setReason(reason);
        step.setKeyCharacters(keyCharacters != null ? keyCharacters : c.getCastMembers());
        step.setIsWatched(watchedIds.contains(c.getId()));
        return step;
    }
}

