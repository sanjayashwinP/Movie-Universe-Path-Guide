package com.cineverse.model.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "external_sources")
public class ExternalSource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name; // e.g. "Marvel Official Website", "Disney+ Press", "StarWars.com"

    @Column(nullable = false, length = 500)
    private String url;

    @Column(name = "trust_score")
    private Integer trustScore = 100;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    public ExternalSource() {}

    public ExternalSource(String name, String url, Integer trustScore) {
        this.name = name;
        this.url = url;
        this.trustScore = trustScore;
        this.isActive = true;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public Integer getTrustScore() { return trustScore; }
    public void setTrustScore(Integer trustScore) { this.trustScore = trustScore; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}
