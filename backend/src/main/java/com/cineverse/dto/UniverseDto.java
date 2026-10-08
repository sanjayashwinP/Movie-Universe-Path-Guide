package com.cineverse.dto;

import java.util.List;

public class UniverseDto {
    private Long id;
    private Long franchiseId;
    private String franchiseName;
    private String name;
    private String slug;
    private String designation;
    private String description;
    private String bannerUrl;
    private Integer displayOrder;
    private List<TimelineDto> timelines;
    private Long contentCount;

    public UniverseDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getFranchiseId() { return franchiseId; }
    public void setFranchiseId(Long franchiseId) { this.franchiseId = franchiseId; }

    public String getFranchiseName() { return franchiseName; }
    public void setFranchiseName(String franchiseName) { this.franchiseName = franchiseName; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getBannerUrl() { return bannerUrl; }
    public void setBannerUrl(String bannerUrl) { this.bannerUrl = bannerUrl; }

    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }

    public List<TimelineDto> getTimelines() { return timelines; }
    public void setTimelines(List<TimelineDto> timelines) { this.timelines = timelines; }

    public Long getContentCount() { return contentCount; }
    public void setContentCount(Long contentCount) { this.contentCount = contentCount; }
}
