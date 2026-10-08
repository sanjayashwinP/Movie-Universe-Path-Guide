package com.cineverse.dto;

import com.cineverse.model.enums.ContentStatus;
import com.cineverse.model.enums.ContentType;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class ContentDetailDto {
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
    private String fullSynopsis;
    private Boolean hasSpoilers;
    private String postCreditScene;
    private String director;
    private String writers;
    private String castMembers;
    private String productionStudio;
    private String posterUrl;
    private String backdropUrl;
    private String trailerUrl;
    private String officialWebsiteUrl;

    // Numerical order numbers
    private Integer releaseOrderNum;
    private Integer chronologicalOrderNum;
    private Integer timelineOrderNum;

    // Hierarchy ("Where Does This Fit?")
    private WhereDoesThisFitDto whereDoesThisFit;

    // Previous and Next Recommendations ("Before and After")
    private List<ContentRelationshipDto> watchBefore = new ArrayList<>();
    private List<ContentRelationshipDto> watchAfter = new ArrayList<>();
    private List<ContentRelationshipDto> relatedContent = new ArrayList<>();

    // Series Seasons & Episodes
    private List<SeasonDto> seasons = new ArrayList<>();

    // Streaming Platforms
    private List<PlatformAvailabilityDto> streamingPlatforms = new ArrayList<>();

    // User tracking info
    private Boolean isWatched = false;
    private LocalDateTime watchedAt;
    private Boolean isInWatchlist = false;
    private String watchlistStatus;
    private Integer userRating;
    private String userNotes;
    private Integer seriesProgressPercentage = 0;

    public ContentDetailDto() {}

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

    public String getFullSynopsis() { return fullSynopsis; }
    public void setFullSynopsis(String fullSynopsis) { this.fullSynopsis = fullSynopsis; }

    public Boolean getHasSpoilers() { return hasSpoilers; }
    public void setHasSpoilers(Boolean hasSpoilers) { this.hasSpoilers = hasSpoilers; }

    public String getPostCreditScene() { return postCreditScene; }
    public void setPostCreditScene(String postCreditScene) { this.postCreditScene = postCreditScene; }

    public String getDirector() { return director; }
    public void setDirector(String director) { this.director = director; }

    public String getWriters() { return writers; }
    public void setWriters(String writers) { this.writers = writers; }

    public String getCastMembers() { return castMembers; }
    public void setCastMembers(String castMembers) { this.castMembers = castMembers; }

    public String getProductionStudio() { return productionStudio; }
    public void setProductionStudio(String productionStudio) { this.productionStudio = productionStudio; }

    public String getPosterUrl() { return posterUrl; }
    public void setPosterUrl(String posterUrl) { this.posterUrl = posterUrl; }

    public String getBackdropUrl() { return backdropUrl; }
    public void setBackdropUrl(String backdropUrl) { this.backdropUrl = backdropUrl; }

    public String getTrailerUrl() { return trailerUrl; }
    public void setTrailerUrl(String trailerUrl) { this.trailerUrl = trailerUrl; }

    public String getOfficialWebsiteUrl() { return officialWebsiteUrl; }
    public void setOfficialWebsiteUrl(String officialWebsiteUrl) { this.officialWebsiteUrl = officialWebsiteUrl; }

    public Integer getReleaseOrderNum() { return releaseOrderNum; }
    public void setReleaseOrderNum(Integer releaseOrderNum) { this.releaseOrderNum = releaseOrderNum; }

    public Integer getChronologicalOrderNum() { return chronologicalOrderNum; }
    public void setChronologicalOrderNum(Integer chronologicalOrderNum) { this.chronologicalOrderNum = chronologicalOrderNum; }

    public Integer getTimelineOrderNum() { return timelineOrderNum; }
    public void setTimelineOrderNum(Integer timelineOrderNum) { this.timelineOrderNum = timelineOrderNum; }

    public WhereDoesThisFitDto getWhereDoesThisFit() { return whereDoesThisFit; }
    public void setWhereDoesThisFit(WhereDoesThisFitDto whereDoesThisFit) { this.whereDoesThisFit = whereDoesThisFit; }

    public List<ContentRelationshipDto> getWatchBefore() { return watchBefore; }
    public void setWatchBefore(List<ContentRelationshipDto> watchBefore) { this.watchBefore = watchBefore; }

    public List<ContentRelationshipDto> getWatchAfter() { return watchAfter; }
    public void setWatchAfter(List<ContentRelationshipDto> watchAfter) { this.watchAfter = watchAfter; }

    public List<ContentRelationshipDto> getRelatedContent() { return relatedContent; }
    public void setRelatedContent(List<ContentRelationshipDto> relatedContent) { this.relatedContent = relatedContent; }

    public List<SeasonDto> getSeasons() { return seasons; }
    public void setSeasons(List<SeasonDto> seasons) { this.seasons = seasons; }

    public List<PlatformAvailabilityDto> getStreamingPlatforms() { return streamingPlatforms; }
    public void setStreamingPlatforms(List<PlatformAvailabilityDto> streamingPlatforms) { this.streamingPlatforms = streamingPlatforms; }

    public Boolean getIsWatched() { return isWatched; }
    public void setIsWatched(Boolean isWatched) { this.isWatched = isWatched; }

    public LocalDateTime getWatchedAt() { return watchedAt; }
    public void setWatchedAt(LocalDateTime watchedAt) { this.watchedAt = watchedAt; }

    public Boolean getIsInWatchlist() { return isInWatchlist; }
    public void setIsInWatchlist(Boolean isInWatchlist) { this.isInWatchlist = isInWatchlist; }

    public String getWatchlistStatus() { return watchlistStatus; }
    public void setWatchlistStatus(String watchlistStatus) { this.watchlistStatus = watchlistStatus; }

    public Integer getUserRating() { return userRating; }
    public void setUserRating(Integer userRating) { this.userRating = userRating; }

    public String getUserNotes() { return userNotes; }
    public void setUserNotes(String userNotes) { this.userNotes = userNotes; }

    public Integer getSeriesProgressPercentage() { return seriesProgressPercentage; }
    public void setSeriesProgressPercentage(Integer seriesProgressPercentage) { this.seriesProgressPercentage = seriesProgressPercentage; }
}
