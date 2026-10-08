package com.cineverse.dto;

public class TimelineDto {
    private Long id;
    private Long universeId;
    private String universeName;
    private String name;
    private String slug;
    private Boolean isMainTimeline;
    private String branchPointDescription;
    private String description;
    private Integer displayOrder;
    private Long contentCount;

    public TimelineDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUniverseId() { return universeId; }
    public void setUniverseId(Long universeId) { this.universeId = universeId; }

    public String getUniverseName() { return universeName; }
    public void setUniverseName(String universeName) { this.universeName = universeName; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public Boolean getIsMainTimeline() { return isMainTimeline; }
    public void setIsMainTimeline(Boolean isMainTimeline) { this.isMainTimeline = isMainTimeline; }

    public String getBranchPointDescription() { return branchPointDescription; }
    public void setBranchPointDescription(String branchPointDescription) { this.branchPointDescription = branchPointDescription; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }

    public Long getContentCount() { return contentCount; }
    public void setContentCount(Long contentCount) { this.contentCount = contentCount; }
}
