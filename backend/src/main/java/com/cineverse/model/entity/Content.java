package com.cineverse.model.entity;

import com.cineverse.model.enums.ContentStatus;
import com.cineverse.model.enums.ContentType;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "contents", indexes = {
    @Index(name = "idx_content_slug", columnList = "slug"),
    @Index(name = "idx_content_type", columnList = "content_type"),
    @Index(name = "idx_content_status", columnList = "status"),
    @Index(name = "idx_content_release_order", columnList = "release_order_num"),
    @Index(name = "idx_content_chrono_order", columnList = "chronological_order_num"),
    @Index(name = "idx_content_timeline_order", columnList = "timeline_order_num")
})
public class Content {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(name = "original_title", length = 200)
    private String originalTitle;

    @Column(nullable = false, unique = true, length = 200)
    private String slug;

    @Enumerated(EnumType.STRING)
    @Column(name = "content_type", nullable = false, length = 30)
    private ContentType contentType = ContentType.MOVIE;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ContentStatus status = ContentStatus.RELEASED;

    @Column(name = "release_date")
    private LocalDate releaseDate;

    @Column(name = "release_year")
    private Integer releaseYear;

    @Column(name = "runtime_minutes")
    private Integer runtimeMinutes;

    @Column(length = 50)
    private String rating; // e.g. "PG-13", "TV-14", "8.5 IMDb"

    @Column(length = 200)
    private String genres; // e.g. "Action, Sci-Fi, Adventure"

    @Column(name = "short_synopsis", columnDefinition = "TEXT")
    private String shortSynopsis;

    @Column(name = "full_synopsis", columnDefinition = "TEXT")
    private String fullSynopsis;

    @Column(name = "has_spoilers")
    private Boolean hasSpoilers = false;

    @Column(name = "post_credit_scene", columnDefinition = "TEXT")
    private String postCreditScene;

    @Column(length = 255)
    private String director;

    @Column(length = 255)
    private String writers;

    @Column(name = "cast_members", columnDefinition = "TEXT")
    private String castMembers;

    @Column(name = "production_studio", length = 100)
    private String productionStudio;

    @Column(name = "poster_url", columnDefinition = "TEXT")
    private String posterUrl;

    @Column(name = "backdrop_url", columnDefinition = "TEXT")
    private String backdropUrl;

    @Column(name = "trailer_url", length = 500)
    private String trailerUrl;

    @Column(name = "official_website_url", length = 500)
    private String officialWebsiteUrl;

    // Numerical order indicators
    @Column(name = "release_order_num")
    private Integer releaseOrderNum;

    @Column(name = "chronological_order_num")
    private Integer chronologicalOrderNum;

    @Column(name = "timeline_order_num")
    private Integer timelineOrderNum;

    @Column(name = "is_published", nullable = false)
    private Boolean isPublished = true;

    // Hierarchical Taxonomies
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "franchise_id", nullable = false)
    private Franchise franchise;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "universe_id")
    private Universe universe;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "timeline_id")
    private Timeline timeline;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "saga_id")
    private Saga saga;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "phase_id")
    private Phase phase;

    @OneToMany(mappedBy = "content", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("seasonNumber ASC")
    private List<Season> seasons = new ArrayList<>();

    @OneToMany(mappedBy = "content", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PlatformAvailability> streamingPlatforms = new ArrayList<>();

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Content() {}

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getOriginalTitle() { return originalTitle; }
    public void setOriginalTitle(String originalTitle) { this.originalTitle = originalTitle; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public ContentType getContentType() { return contentType; }
    public void setContentType(ContentType contentType) { this.contentType = contentType; }

    public ContentStatus getStatus() { return status; }
    public void setStatus(ContentStatus status) { this.status = status; }

    public LocalDate getReleaseDate() { return releaseDate; }
    public void setReleaseDate(LocalDate releaseDate) { this.releaseDate = releaseDate; }

    public Integer getReleaseYear() { return releaseYear; }
    public void setReleaseYear(Integer releaseYear) { this.releaseYear = releaseYear; }

    public Integer getRuntimeMinutes() { return runtimeMinutes; }
    public void setRuntimeMinutes(Integer runtimeMinutes) { this.runtimeMinutes = runtimeMinutes; }

    public String getRating() { return rating; }
    public void setRating(String rating) { this.rating = rating; }

    public String getGenres() { return genres; }
    public void setGenres(String genres) { this.genres = genres; }

    public String getShortSynopsis() { return shortSynopsis; }
    public void setShortSynopsis(String shortSynopsis) { this.shortSynopsis = shortSynopsis; }

    public String getFullSynopsis() { return fullSynopsis; }
    public void setFullSynopsis(String fullSynopsis) { this.fullSynopsis = fullSynopsis; }

    public Boolean getHasSpoilers() { return hasSpoilers; }
    public void setHasSpoilers(Boolean hasSpoilers) { this.hasSpoilers = hasSpoilers; }

    public String getPostCreditScene() { return postCreditScene; }
    public void setPostCreditScene(String postCreditScene) { this.postCreditScene = postCreditScene; }

    public String getDirector() { return director; }
    public void setDirector(String director) { this.director = director; }

    public String getWriters() { return writers; }
    public void setWriters(String writers) { this.writers = writers; }

    public String getCastMembers() { return castMembers; }
    public void setCastMembers(String castMembers) { this.castMembers = castMembers; }

    public String getProductionStudio() { return productionStudio; }
    public void setProductionStudio(String productionStudio) { this.productionStudio = productionStudio; }

    public String getPosterUrl() { return posterUrl; }
    public void setPosterUrl(String posterUrl) { this.posterUrl = posterUrl; }

    public String getBackdropUrl() { return backdropUrl; }
    public void setBackdropUrl(String backdropUrl) { this.backdropUrl = backdropUrl; }

    public String getTrailerUrl() { return trailerUrl; }
    public void setTrailerUrl(String trailerUrl) { this.trailerUrl = trailerUrl; }

    public String getOfficialWebsiteUrl() { return officialWebsiteUrl; }
    public void setOfficialWebsiteUrl(String officialWebsiteUrl) { this.officialWebsiteUrl = officialWebsiteUrl; }

    public Integer getReleaseOrderNum() { return releaseOrderNum; }
    public void setReleaseOrderNum(Integer releaseOrderNum) { this.releaseOrderNum = releaseOrderNum; }

    public Integer getChronologicalOrderNum() { return chronologicalOrderNum; }
    public void setChronologicalOrderNum(Integer chronologicalOrderNum) { this.chronologicalOrderNum = chronologicalOrderNum; }

    public Integer getTimelineOrderNum() { return timelineOrderNum; }
    public void setTimelineOrderNum(Integer timelineOrderNum) { this.timelineOrderNum = timelineOrderNum; }

    public Boolean getIsPublished() { return isPublished; }
    public void setIsPublished(Boolean isPublished) { this.isPublished = isPublished; }

    public Franchise getFranchise() { return franchise; }
    public void setFranchise(Franchise franchise) { this.franchise = franchise; }

    public Universe getUniverse() { return universe; }
    public void setUniverse(Universe universe) { this.universe = universe; }

    public Timeline getTimeline() { return timeline; }
    public void setTimeline(Timeline timeline) { this.timeline = timeline; }

    public Saga getSaga() { return saga; }
    public void setSaga(Saga saga) { this.saga = saga; }

    public Phase getPhase() { return phase; }
    public void setPhase(Phase phase) { this.phase = phase; }

    public List<Season> getSeasons() { return seasons; }
    public void setSeasons(List<Season> seasons) { this.seasons = seasons; }

    public List<PlatformAvailability> getStreamingPlatforms() { return streamingPlatforms; }
    public void setStreamingPlatforms(List<PlatformAvailability> streamingPlatforms) { this.streamingPlatforms = streamingPlatforms; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
