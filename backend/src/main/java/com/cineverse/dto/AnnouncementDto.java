package com.cineverse.dto;

import com.cineverse.model.enums.AnnouncementType;
import java.time.LocalDateTime;

public class AnnouncementDto {
    private Long id;
    private String title;
    private String description;
    private AnnouncementType type;
    private String relatedFranchise;
    private String officialUrl;
    private LocalDateTime publishedAt;

    public AnnouncementDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public AnnouncementType getType() { return type; }
    public void setType(AnnouncementType type) { this.type = type; }

    public String getRelatedFranchise() { return relatedFranchise; }
    public void setRelatedFranchise(String relatedFranchise) { this.relatedFranchise = relatedFranchise; }

    public String getOfficialUrl() { return officialUrl; }
    public void setOfficialUrl(String officialUrl) { this.officialUrl = officialUrl; }

    public LocalDateTime getPublishedAt() { return publishedAt; }
    public void setPublishedAt(LocalDateTime publishedAt) { this.publishedAt = publishedAt; }
}
