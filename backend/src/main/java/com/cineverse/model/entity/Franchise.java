package com.cineverse.model.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "franchises")
public class Franchise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 100)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "banner_url", length = 500)
    private String bannerUrl;

    @Column(name = "logo_url", length = 500)
    private String logoUrl;

    @Column(name = "display_order")
    private Integer displayOrder = 1;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @OneToMany(mappedBy = "franchise", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Universe> universes = new ArrayList<>();

    @OneToMany(mappedBy = "franchise", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Saga> sagas = new ArrayList<>();

    public Franchise() {}

    public Franchise(String name, String slug, String description, String bannerUrl, String logoUrl, Integer displayOrder) {
        this.name = name;
        this.slug = slug;
        this.description = description;
        this.bannerUrl = bannerUrl;
        this.logoUrl = logoUrl;
        this.displayOrder = displayOrder;
        this.isActive = true;
    }

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

    public List<Universe> getUniverses() { return universes; }
    public void setUniverses(List<Universe> universes) { this.universes = universes; }

    public List<Saga> getSagas() { return sagas; }
    public void setSagas(List<Saga> sagas) { this.sagas = sagas; }
}
