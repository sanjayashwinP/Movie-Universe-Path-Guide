package com.cineverse.dto;

import com.cineverse.model.enums.RelationshipType;

public class ContentRelationshipDto {
    private Long id;
    private Long relatedContentId;
    private String relatedContentTitle;
    private String relatedContentSlug;
    private String relatedContentType;
    private Integer relatedContentReleaseYear;
    private String relatedContentPosterUrl;
    private RelationshipType relationshipType;
    private String notes;
    private Boolean isWatched = false;

    public ContentRelationshipDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getRelatedContentId() { return relatedContentId; }
    public void setRelatedContentId(Long relatedContentId) { this.relatedContentId = relatedContentId; }

    public String getRelatedContentTitle() { return relatedContentTitle; }
    public void setRelatedContentTitle(String relatedContentTitle) { this.relatedContentTitle = relatedContentTitle; }

    public String getRelatedContentSlug() { return relatedContentSlug; }
    public void setRelatedContentSlug(String relatedContentSlug) { this.relatedContentSlug = relatedContentSlug; }

    public String getRelatedContentType() { return relatedContentType; }
    public void setRelatedContentType(String relatedContentType) { this.relatedContentType = relatedContentType; }

    public Integer getRelatedContentReleaseYear() { return relatedContentReleaseYear; }
    public void setRelatedContentReleaseYear(Integer relatedContentReleaseYear) { this.relatedContentReleaseYear = relatedContentReleaseYear; }

    public String getRelatedContentPosterUrl() { return relatedContentPosterUrl; }
    public void setRelatedContentPosterUrl(String relatedContentPosterUrl) { this.relatedContentPosterUrl = relatedContentPosterUrl; }

    public RelationshipType getRelationshipType() { return relationshipType; }
    public void setRelationshipType(RelationshipType relationshipType) { this.relationshipType = relationshipType; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Boolean getIsWatched() { return isWatched; }
    public void setIsWatched(Boolean isWatched) { this.isWatched = isWatched; }
}
