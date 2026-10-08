package com.cineverse.model.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "platforms")
public class Platform {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name; // e.g. "Disney+", "Netflix", "Prime Video", "Apple TV+", "Max"

    @Column(nullable = false, unique = true, length = 100)
    private String slug;

    @Column(name = "logo_url", length = 500)
    private String logoUrl;

    @Column(name = "base_url", length = 500)
    private String baseUrl;

    @Column(name = "brand_color", length = 30)
    private String brandColor; // e.g. "#113CCF" for Disney+

    public Platform() {}

    public Platform(String name, String slug, String logoUrl, String baseUrl, String brandColor) {
        this.name = name;
        this.slug = slug;
        this.logoUrl = logoUrl;
        this.baseUrl = baseUrl;
        this.brandColor = brandColor;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }

    public String getBaseUrl() { return baseUrl; }
    public void setBaseUrl(String baseUrl) { this.baseUrl = baseUrl; }

    public String getBrandColor() { return brandColor; }
    public void setBrandColor(String brandColor) { this.brandColor = brandColor; }
}
