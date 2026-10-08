package com.cineverse.model.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "universes")
public class Universe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "franchise_id", nullable = false)
    private Franchise franchise;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 100)
    private String slug;

    @Column(length = 50)
    private String designation; // e.g. "Earth-616", "Earth-199999", "Earth-838"

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "banner_url", length = 500)
    private String bannerUrl;

    @Column(name = "display_order")
    private Integer displayOrder = 1;

    @OneToMany(mappedBy = "universe", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Timeline> timelines = new ArrayList<>();

    public Universe() {}

    public Universe(Franchise franchise, String name, String slug, String designation, String description, Integer displayOrder) {
        this.franchise = franchise;
        this.name = name;
        this.slug = slug;
        this.designation = designation;
        this.description = description;
        this.displayOrder = displayOrder;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Franchise getFranchise() { return franchise; }
    public void setFranchise(Franchise franchise) { this.franchise = franchise; }

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

    public List<Timeline> getTimelines() { return timelines; }
    public void setTimelines(List<Timeline> timelines) { this.timelines = timelines; }
}
