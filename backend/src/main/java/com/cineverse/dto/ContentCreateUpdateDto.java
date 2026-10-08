package com.cineverse.dto;

import com.cineverse.model.enums.ContentStatus;
import com.cineverse.model.enums.ContentType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

public class ContentCreateUpdateDto {
    @NotBlank(message = "Title is required")
    private String title;

    private String originalTitle;
    private String slug;

    @NotNull(message = "Content type is required")
    private ContentType contentType;

    @NotNull(message = "Status is required")
    private ContentStatus status;

    private LocalDate releaseDate;
    private Integer releaseYear;
    private Integer runtimeMinutes;
    private String rating;
    private String genres;
    private String shortSynopsis;
    private String fullSynopsis;
    private Boolean hasSpoilers = false;
    private String postCreditScene;
    private String director;
    private String writers;
    private String castMembers;
    private String productionStudio;
    private String posterUrl;
    private String backdropUrl;
    private String trailerUrl;
    private String officialWebsiteUrl;

    private Integer releaseOrderNum;
    private Integer chronologicalOrderNum;
    private Integer timelineOrderNum;
    private Boolean isPublished = true;

    // Taxonomy IDs
    @NotNull(message = "Franchise is required")
    private Long franchiseId;

    private Long universeId;
    private Long timelineId;
    private Long sagaId;
    private Long phaseId;

    // Optional relationships
    private List<Long> prerequisiteIds;
    private List<Long> nextWatchIds;

    public ContentCreateUpdateDto() {}

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

    public Boolean getIsPublished() { return isPublished; }
    public void setIsPublished(Boolean isPublished) { this.isPublished = isPublished; }

    public Long getFranchiseId() { return franchiseId; }
    public void setFranchiseId(Long franchiseId) { this.franchiseId = franchiseId; }

    public Long getUniverseId() { return universeId; }
    public void setUniverseId(Long universeId) { this.universeId = universeId; }

    public Long getTimelineId() { return timelineId; }
    public void setTimelineId(Long timelineId) { this.timelineId = timelineId; }

    public Long getSagaId() { return sagaId; }
    public void setSagaId(Long sagaId) { this.sagaId = sagaId; }

    public Long getPhaseId() { return phaseId; }
    public void setPhaseId(Long phaseId) { this.phaseId = phaseId; }

    public List<Long> getPrerequisiteIds() { return prerequisiteIds; }
    public void setPrerequisiteIds(List<Long> prerequisiteIds) { this.prerequisiteIds = prerequisiteIds; }

    public List<Long> getNextWatchIds() { return nextWatchIds; }
    public void setNextWatchIds(List<Long> nextWatchIds) { this.nextWatchIds = nextWatchIds; }
}
