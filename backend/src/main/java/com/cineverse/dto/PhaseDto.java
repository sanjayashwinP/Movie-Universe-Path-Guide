package com.cineverse.dto;

public class PhaseDto {
    private Long id;
    private Long sagaId;
    private String sagaName;
    private String name;
    private String slug;
    private Integer phaseNumber;
    private String description;
    private Long contentCount;

    public PhaseDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getSagaId() { return sagaId; }
    public void setSagaId(Long sagaId) { this.sagaId = sagaId; }

    public String getSagaName() { return sagaName; }
    public void setSagaName(String sagaName) { this.sagaName = sagaName; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public Integer getPhaseNumber() { return phaseNumber; }
    public void setPhaseNumber(Integer phaseNumber) { this.phaseNumber = phaseNumber; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Long getContentCount() { return contentCount; }
    public void setContentCount(Long contentCount) { this.contentCount = contentCount; }
}
