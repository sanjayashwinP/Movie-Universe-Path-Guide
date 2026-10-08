package com.cineverse.model.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "timelines")
public class Timeline {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "universe_id", nullable = false)
    private Universe universe;

    @Column(nullable = false, length = 100)
    private String name; // e.g. "Sacred Timeline", "2012 Branch", "TVA Void", "X-Men Original", "X-Men Revised"

    @Column(nullable = false, length = 100)
    private String slug;

    @Column(name = "is_main_timeline", nullable = false)
    private Boolean isMainTimeline = false;

    @Column(name = "branch_point_description", length = 255)
    private String branchPointDescription;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "display_order")
    private Integer displayOrder = 1;

    public Timeline() {}

    public Timeline(Universe universe, String name, String slug, Boolean isMainTimeline, String branchPointDescription, String description, Integer displayOrder) {
        this.universe = universe;
        this.name = name;
        this.slug = slug;
        this.isMainTimeline = isMainTimeline;
        this.branchPointDescription = branchPointDescription;
        this.description = description;
        this.displayOrder = displayOrder;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Universe getUniverse() { return universe; }
    public void setUniverse(Universe universe) { this.universe = universe; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public Boolean getIsMainTimeline() { return isMainTimeline; }
    public void setIsMainTimeline(Boolean isMainTimeline) { this.isMainTimeline = isMainTimeline; }

    public String getBranchPointDescription() { return branchPointDescription; }
    public void setBranchPointDescription(String branchPointDescription) { this.branchPointDescription = branchPointDescription; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
}
