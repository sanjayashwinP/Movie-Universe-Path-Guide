package com.cineverse.model.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "watch_histories", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "content_id"})
})
public class WatchHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "content_id", nullable = false)
    private Content content;

    @Column(name = "watched_at", nullable = false)
    private LocalDateTime watchedAt = LocalDateTime.now();

    @Column(name = "times_watched", nullable = false)
    private Integer timesWatched = 1;

    public WatchHistory() {}

    public WatchHistory(AppUser user, Content content) {
        this.user = user;
        this.content = content;
        this.watchedAt = LocalDateTime.now();
        this.timesWatched = 1;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public AppUser getUser() { return user; }
    public void setUser(AppUser user) { this.user = user; }

    public Content getContent() { return content; }
    public void setContent(Content content) { this.content = content; }

    public LocalDateTime getWatchedAt() { return watchedAt; }
    public void setWatchedAt(LocalDateTime watchedAt) { this.watchedAt = watchedAt; }

    public Integer getTimesWatched() { return timesWatched; }
    public void setTimesWatched(Integer timesWatched) { this.timesWatched = timesWatched; }
}
