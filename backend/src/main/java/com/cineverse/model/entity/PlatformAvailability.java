package com.cineverse.model.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "platform_availabilities")
public class PlatformAvailability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "content_id", nullable = false)
    private Content content;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "platform_id", nullable = false)
    private Platform platform;

    @Column(name = "country_code", length = 10)
    private String countryCode = "US"; // "US", "GLOBAL", "GB", etc.

    @Column(nullable = false, length = 500)
    private String url;

    @Column(name = "is_free_with_sub")
    private Boolean isFreeWithSub = true;

    @Column(length = 30)
    private String quality; // "4K HDR", "IMAX Enhanced", "HD"

    public PlatformAvailability() {}

    public PlatformAvailability(Content content, Platform platform, String countryCode, String url, Boolean isFreeWithSub, String quality) {
        this.content = content;
        this.platform = platform;
        this.countryCode = countryCode;
        this.url = url;
        this.isFreeWithSub = isFreeWithSub;
        this.quality = quality;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Content getContent() { return content; }
    public void setContent(Content content) { this.content = content; }

    public Platform getPlatform() { return platform; }
    public void setPlatform(Platform platform) { this.platform = platform; }

    public String getCountryCode() { return countryCode; }
    public void setCountryCode(String countryCode) { this.countryCode = countryCode; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public Boolean getIsFreeWithSub() { return isFreeWithSub; }
    public void setIsFreeWithSub(Boolean isFreeWithSub) { this.isFreeWithSub = isFreeWithSub; }

    public String getQuality() { return quality; }
    public void setQuality(String quality) { this.quality = quality; }
}
