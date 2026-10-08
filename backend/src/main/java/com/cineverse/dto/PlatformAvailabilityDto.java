package com.cineverse.dto;

public class PlatformAvailabilityDto {
    private Long id;
    private Long platformId;
    private String platformName;
    private String platformSlug;
    private String platformLogoUrl;
    private String platformBrandColor;
    private String countryCode;
    private String url;
    private Boolean isFreeWithSub;
    private String quality;

    public PlatformAvailabilityDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPlatformId() { return platformId; }
    public void setPlatformId(Long platformId) { this.platformId = platformId; }

    public String getPlatformName() { return platformName; }
    public void setPlatformName(String platformName) { this.platformName = platformName; }

    public String getPlatformSlug() { return platformSlug; }
    public void setPlatformSlug(String platformSlug) { this.platformSlug = platformSlug; }

    public String getPlatformLogoUrl() { return platformLogoUrl; }
    public void setPlatformLogoUrl(String platformLogoUrl) { this.platformLogoUrl = platformLogoUrl; }

    public String getPlatformBrandColor() { return platformBrandColor; }
    public void setPlatformBrandColor(String platformBrandColor) { this.platformBrandColor = platformBrandColor; }

    public String getCountryCode() { return countryCode; }
    public void setCountryCode(String countryCode) { this.countryCode = countryCode; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public Boolean getIsFreeWithSub() { return isFreeWithSub; }
    public void setIsFreeWithSub(Boolean isFreeWithSub) { this.isFreeWithSub = isFreeWithSub; }

    public String getQuality() { return quality; }
    public void setQuality(String quality) { this.quality = quality; }
}
