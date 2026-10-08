package com.cineverse.dto;

import java.util.List;

public class FranchiseDto {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private String bannerUrl;
    private String logoUrl;
    private Integer displayOrder;
    private Boolean isActive;
    private List<UniverseDto> universes;
    private List<SagaDto> sagas;

    public FranchiseDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getBannerUrl() { return bannerUrl; }
    public void setBannerUrl(String bannerUrl) { this.bannerUrl = bannerUrl; }

    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }

    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public List<UniverseDto> getUniverses() { return universes; }
    public void setUniverses(List<UniverseDto> universes) { this.universes = universes; }

    public List<SagaDto> getSagas() { return sagas; }
    public void setSagas(List<SagaDto> sagas) { this.sagas = sagas; }
}
