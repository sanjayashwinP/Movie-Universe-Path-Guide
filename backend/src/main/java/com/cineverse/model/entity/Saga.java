package com.cineverse.model.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sagas")
public class Saga {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "franchise_id", nullable = false)
    private Franchise franchise;

    @Column(nullable = false, length = 100)
    private String name; // e.g. "The Infinity Saga", "The Multiverse Saga"

    @Column(nullable = false, length = 100)
    private String slug;

    @Column(name = "order_index", nullable = false)
    private Integer orderIndex = 1;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "poster_url", length = 500)
    private String posterUrl;

    @Column(name = "banner_url", length = 500)
    private String bannerUrl;

    @OneToMany(mappedBy = "saga", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Phase> phases = new ArrayList<>();

    public Saga() {}

    public Saga(Franchise franchise, String name, String slug, Integer orderIndex, String description, String posterUrl, String bannerUrl) {
        this.franchise = franchise;
        this.name = name;
        this.slug = slug;
        this.orderIndex = orderIndex;
        this.description = description;
        this.posterUrl = posterUrl;
        this.bannerUrl = bannerUrl;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Franchise getFranchise() { return franchise; }
    public void setFranchise(Franchise franchise) { this.franchise = franchise; }

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

    public List<Phase> getPhases() { return phases; }
    public void setPhases(List<Phase> phases) { this.phases = phases; }
}
