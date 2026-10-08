package com.cineverse.dto;

import com.cineverse.model.enums.ContentStatus;
import com.cineverse.model.enums.ContentType;
import java.time.LocalDate;

public class ContentSummaryDto {
    private Long id;
    private String title;
    private String originalTitle;
    private String slug;
    private ContentType contentType;
    private ContentStatus status;
    private LocalDate releaseDate;
    private Integer releaseYear;
    private Integer runtimeMinutes;
    private String rating;
    private String genres;
    private String shortSynopsis;
    private String posterUrl;
    private String backdropUrl;

    // Numerical order numbers
    private Integer releaseOrderNum;
    private Integer chronologicalOrderNum;
    private Integer timelineOrderNum;

    // Hierarchy labels
    private Long franchiseId;
    private String franchiseName;
    private String franchiseSlug;

    private Long universeId;
    private String universeName;
    private String universeSlug;
    private String universeDesignation;

    private Long timelineId;
    private String timelineName;
    private String timelineSlug;
    private Boolean isMainTimeline;

    private Long sagaId;
    private String sagaName;
    private String sagaSlug;

    private Long phaseId;
    private String phaseName;
    private Integer phaseNumber;

    // User Watch Status
    private Boolean isWatched = false;
    private Boolean isInWatchlist = false;
    private String watchlistStatus;
    private Integer progressPercentage = 0; // For TV series

    public ContentSummaryDto() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getOriginalTitle() { return originalTitle; }
    public void setOriginalTitle(String originalTitle) { this.originalTitle = originalTitle; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public ContentType getContentType() { return contentType; }
    public void setContentType(ContentType contentType) { this.contentType = contentType; }

    public ContentStatus getStatus() { return status; }
    public void setStatus(ContentStatus status) { this.status = status; }

    public LocalDate getReleaseDate() { return releaseDate; }
    public void setReleaseDate(LocalDate releaseDate) { this.releaseDate = releaseDate; }

    public Integer getReleaseYear() { return releaseYear; }
    public void setReleaseYear(Integer releaseYear) { this.releaseYear = releaseYear; }

    public Integer getRuntimeMinutes() { return runtimeMinutes; }
    public void setRuntimeMinutes(Integer runtimeMinutes) { this.runtimeMinutes = runtimeMinutes; }

    public String getRating() { return rating; }
    public void setRating(String rating) { this.rating = rating; }

    public String getGenres() { return genres; }
    public void setGenres(String genres) { this.genres = genres; }

    public String getShortSynopsis() { return shortSynopsis; }
    public void setShortSynopsis(String shortSynopsis) { this.shortSynopsis = shortSynopsis; }

    public String getPosterUrl() { return posterUrl; }
    public void setPosterUrl(String posterUrl) { this.posterUrl = posterUrl; }

    public String getBackdropUrl() { return backdropUrl; }
    public void setBackdropUrl(String backdropUrl) { this.backdropUrl = backdropUrl; }

    public Integer getReleaseOrderNum() { return releaseOrderNum; }
    public void setReleaseOrderNum(Integer releaseOrderNum) { this.releaseOrderNum = releaseOrderNum; }

    public Integer getChronologicalOrderNum() { return chronologicalOrderNum; }
    public void setChronologicalOrderNum(Integer chronologicalOrderNum) { this.chronologicalOrderNum = chronologicalOrderNum; }

    public Integer getTimelineOrderNum() { return timelineOrderNum; }
    public void setTimelineOrderNum(Integer timelineOrderNum) { this.timelineOrderNum = timelineOrderNum; }

    public Long getFranchiseId() { return franchiseId; }
    public void setFranchiseId(Long franchiseId) { this.franchiseId = franchiseId; }

    public String getFranchiseName() { return franchiseName; }
    public void setFranchiseName(String franchiseName) { this.franchiseName = franchiseName; }

    public String getFranchiseSlug() { return franchiseSlug; }
    public void setFranchiseSlug(String franchiseSlug) { this.franchiseSlug = franchiseSlug; }

    public Long getUniverseId() { return universeId; }
    public void setUniverseId(Long universeId) { this.universeId = universeId; }

    public String getUniverseName() { return universeName; }
    public void setUniverseName(String universeName) { this.universeName = universeName; }

    public String getUniverseSlug() { return universeSlug; }
    public void setUniverseSlug(String universeSlug) { this.universeSlug = universeSlug; }

    public String getUniverseDesignation() { return universeDesignation; }
    public void setUniverseDesignation(String universeDesignation) { this.universeDesignation = universeDesignation; }

    public Long getTimelineId() { return timelineId; }
    public void setTimelineId(Long timelineId) { this.timelineId = timelineId; }

    public String getTimelineName() { return timelineName; }
    public void setTimelineName(String timelineName) { this.timelineName = timelineName; }

    public String getTimelineSlug() { return timelineSlug; }
    public void setTimelineSlug(String timelineSlug) { this.timelineSlug = timelineSlug; }

    public Boolean getIsMainTimeline() { return isMainTimeline; }
    public void setIsMainTimeline(Boolean isMainTimeline) { this.isMainTimeline = isMainTimeline; }

    public Long getSagaId() { return sagaId; }
    public void setSagaId(Long sagaId) { this.sagaId = sagaId; }

    public String getSagaName() { return sagaName; }
    public void setSagaName(String sagaName) { this.sagaName = sagaName; }

    public String getSagaSlug() { return sagaSlug; }
    public void setSagaSlug(String sagaSlug) { this.sagaSlug = sagaSlug; }

    public Long getPhaseId() { return phaseId; }
    public void setPhaseId(Long phaseId) { this.phaseId = phaseId; }

    public String getPhaseName() { return phaseName; }
    public void setPhaseName(String phaseName) { this.phaseName = phaseName; }

    public Integer getPhaseNumber() { return phaseNumber; }
    public void setPhaseNumber(Integer phaseNumber) { this.phaseNumber = phaseNumber; }

    public Boolean getIsWatched() { return isWatched; }
    public void setIsWatched(Boolean isWatched) { this.isWatched = isWatched; }

    public Boolean getIsInWatchlist() { return isInWatchlist; }
    public void setIsInWatchlist(Boolean isInWatchlist) { this.isInWatchlist = isInWatchlist; }

    public String getWatchlistStatus() { return watchlistStatus; }
    public void setWatchlistStatus(String watchlistStatus) { this.watchlistStatus = watchlistStatus; }

    public Integer getProgressPercentage() { return progressPercentage; }
    public void setProgressPercentage(Integer progressPercentage) { this.progressPercentage = progressPercentage; }
}
