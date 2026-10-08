package com.cineverse.dto;

import com.cineverse.model.enums.WatchlistStatus;
import java.time.LocalDateTime;

public class WatchlistDto {
    private Long id;
    private Long contentId;
    private String contentTitle;
    private String contentSlug;
    private String contentType;
    private Integer contentReleaseYear;
    private String contentPosterUrl;
    private String universeName;
    private String sagaName;
    private WatchlistStatus status;
    private Integer userRating;
    private String notes;
    private LocalDateTime updatedAt;

    public WatchlistDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getContentId() { return contentId; }
    public void setContentId(Long contentId) { this.contentId = contentId; }

    public String getContentTitle() { return contentTitle; }
    public void setContentTitle(String contentTitle) { this.contentTitle = contentTitle; }

    public String getContentSlug() { return contentSlug; }
    public void setContentSlug(String contentSlug) { this.contentSlug = contentSlug; }

    public String getContentType() { return contentType; }
    public void setContentType(String contentType) { this.contentType = contentType; }

    public Integer getContentReleaseYear() { return contentReleaseYear; }
    public void setContentReleaseYear(Integer contentReleaseYear) { this.contentReleaseYear = contentReleaseYear; }

    public String getContentPosterUrl() { return posterUrl(contentPosterUrl); }
    private String posterUrl(String url) { return url; }
    public void setContentPosterUrl(String contentPosterUrl) { this.contentPosterUrl = contentPosterUrl; }

    public String getUniverseName() { return universeName; }
    public void setUniverseName(String universeName) { this.universeName = universeName; }

    public String getSagaName() { return sagaName; }
    public void setSagaName(String sagaName) { this.sagaName = sagaName; }

    public WatchlistStatus getStatus() { return status; }
    public void setStatus(WatchlistStatus status) { this.status = status; }

    public Integer getUserRating() { return userRating; }
    public void setUserRating(Integer userRating) { this.userRating = userRating; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
