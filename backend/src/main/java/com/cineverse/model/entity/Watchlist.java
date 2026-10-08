package com.cineverse.model.entity;

import com.cineverse.model.enums.WatchlistStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "watchlists", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "content_id"})
})
public class Watchlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "content_id", nullable = false)
    private Content content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private WatchlistStatus status = WatchlistStatus.WANT_TO_WATCH;

    @Column(name = "user_rating")
    private Integer userRating; // 1 to 10

    @Column(length = 500)
    private String notes;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Watchlist() {}

    public Watchlist(AppUser user, Content content, WatchlistStatus status) {
        this.user = user;
        this.content = content;
        this.status = status;
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public AppUser getUser() { return user; }
    public void setUser(AppUser user) { this.user = user; }

    public Content getContent() { return content; }
    public void setContent(Content content) { this.content = content; }

    public WatchlistStatus getStatus() { return status; }
    public void setStatus(WatchlistStatus status) { this.status = status; }

    public Integer getUserRating() { return userRating; }
    public void setUserRating(Integer userRating) { this.userRating = userRating; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
