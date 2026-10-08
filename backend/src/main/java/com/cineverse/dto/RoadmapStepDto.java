package com.cineverse.dto;

import com.cineverse.model.enums.ContentType;
import java.time.LocalDate;

public class RoadmapStepDto {
    private Integer stepNumber;
    private Long contentId;
    private String title;
    private String slug;
    private LocalDate releaseDate;
    private Integer releaseYear;
    private Integer runtimeMinutes;
    private ContentType contentType;
    private String universeName;
    private String universeDesignation;
    private String timelineName;
    private String sagaName;
    private String phaseName;
    private String posterUrl;
    private String backdropUrl;
    private String rating;
    private String priority; // CRITICAL_MUST_WATCH, ESSENTIAL_LORE, MULTIVERSE_BRIDGE, CORE_ORIGIN
    private String reason;
    private String keyCharacters;
    private Boolean isWatched;

    public RoadmapStepDto() {
    }

    public Integer getStepNumber() {
        return stepNumber;
    }

    public void setStepNumber(Integer stepNumber) {
        this.stepNumber = stepNumber;
    }

    public Long getContentId() {
        return contentId;
    }

    public void setContentId(Long contentId) {
        this.contentId = contentId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public LocalDate getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(LocalDate releaseDate) {
        this.releaseDate = releaseDate;
    }

    public Integer getReleaseYear() {
        return releaseYear;
    }

    public void setReleaseYear(Integer releaseYear) {
        this.releaseYear = releaseYear;
    }

    public Integer getRuntimeMinutes() {
        return runtimeMinutes;
    }

    public void setRuntimeMinutes(Integer runtimeMinutes) {
        this.runtimeMinutes = runtimeMinutes;
    }

    public ContentType getContentType() {
        return contentType;
    }

    public void setContentType(ContentType contentType) {
        this.contentType = contentType;
    }

    public String getUniverseName() {
        return universeName;
    }

    public void setUniverseName(String universeName) {
        this.universeName = universeName;
    }

    public String getUniverseDesignation() {
        return universeDesignation;
    }

    public void setUniverseDesignation(String universeDesignation) {
        this.universeDesignation = universeDesignation;
    }

    public String getTimelineName() {
        return timelineName;
    }

    public void setTimelineName(String timelineName) {
        this.timelineName = timelineName;
    }

    public String getSagaName() {
        return sagaName;
    }

    public void setSagaName(String sagaName) {
        this.sagaName = sagaName;
    }

    public String getPhaseName() {
        return phaseName;
    }

    public void setPhaseName(String phaseName) {
        this.phaseName = phaseName;
    }

    public String getPosterUrl() {
        return posterUrl;
    }

    public void setPosterUrl(String posterUrl) {
        this.posterUrl = posterUrl;
    }

    public String getBackdropUrl() {
        return backdropUrl;
    }

    public void setBackdropUrl(String backdropUrl) {
        this.backdropUrl = backdropUrl;
    }

    public String getRating() {
        return rating;
    }

    public void setRating(String rating) {
        this.rating = rating;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getKeyCharacters() {
        return keyCharacters;
    }

    public void setKeyCharacters(String keyCharacters) {
        this.keyCharacters = keyCharacters;
    }

    public Boolean getIsWatched() {
        return isWatched;
    }

    public void setIsWatched(Boolean watched) {
        isWatched = watched;
    }
}
