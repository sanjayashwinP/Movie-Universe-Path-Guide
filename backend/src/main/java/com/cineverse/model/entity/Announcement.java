package com.cineverse.model.entity;

import com.cineverse.model.enums.AnnouncementType;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "announcements")
public class Announcement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private AnnouncementType type = AnnouncementType.NEW_PROJECT;

    @Column(name = "related_franchise", length = 100)
    private String relatedFranchise;

    @Column(name = "official_url", length = 500)
    private String officialUrl;

    @Column(name = "published_at", nullable = false)
    private LocalDateTime publishedAt = LocalDateTime.now();

    public Announcement() {}

    public Announcement(String title, String description, AnnouncementType type, String relatedFranchise, String officialUrl) {
        this.title = title;
        this.description = description;
        this.type = type;
        this.relatedFranchise = relatedFranchise;
        this.officialUrl = officialUrl;
        this.publishedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public AnnouncementType getType() { return type; }
    public void setType(AnnouncementType type) { this.type = type; }

    public String getRelatedFranchise() { return relatedFranchise; }
    public void setRelatedFranchise(String relatedFranchise) { this.relatedFranchise = relatedFranchise; }

    public String getOfficialUrl() { return officialUrl; }
    public void setOfficialUrl(String officialUrl) { this.officialUrl = officialUrl; }

    public LocalDateTime getPublishedAt() { return publishedAt; }
    public void setPublishedAt(LocalDateTime publishedAt) { this.publishedAt = publishedAt; }
}
