package com.cineverse.dto;

import java.util.List;

public class SagaDto {
    private Long id;
    private Long franchiseId;
    private String franchiseName;
    private String name;
    private String slug;
    private Integer orderIndex;
    private String description;
    private String posterUrl;
    private String bannerUrl;
    private List<PhaseDto> phases;
    private Long contentCount;

    public SagaDto() {}

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

    public Integer getOrderIndex() { return orderIndex; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPosterUrl() { return posterUrl; }
    public void setPosterUrl(String posterUrl) { this.posterUrl = posterUrl; }

    public String getBannerUrl() { return bannerUrl; }
    public void setBannerUrl(String bannerUrl) { this.bannerUrl = bannerUrl; }

    public List<PhaseDto> getPhases() { return phases; }
    public void setPhases(List<PhaseDto> phases) { this.phases = phases; }

    public Long getContentCount() { return contentCount; }
    public void setContentCount(Long contentCount) { this.contentCount = contentCount; }
}
