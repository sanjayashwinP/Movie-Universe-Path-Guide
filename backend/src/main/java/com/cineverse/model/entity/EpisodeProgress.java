package com.cineverse.model.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "episode_progress", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "episode_id"})
})
public class EpisodeProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "episode_id", nullable = false)
    private Episode episode;

    @Column(name = "is_watched", nullable = false)
    private Boolean isWatched = true;

    @Column(name = "watched_at", nullable = false)
    private LocalDateTime watchedAt = LocalDateTime.now();

    public EpisodeProgress() {}

    public EpisodeProgress(AppUser user, Episode episode, Boolean isWatched) {
        this.user = user;
        this.episode = episode;
        this.isWatched = isWatched;
        this.watchedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public AppUser getUser() { return user; }
    public void setUser(AppUser user) { this.user = user; }

    public Episode getEpisode() { return episode; }
    public void setEpisode(Episode episode) { this.episode = episode; }

    public Boolean getIsWatched() { return isWatched; }
    public void setIsWatched(Boolean isWatched) { this.isWatched = isWatched; }

    public LocalDateTime getWatchedAt() { return watchedAt; }
    public void setWatchedAt(LocalDateTime watchedAt) { this.watchedAt = watchedAt; }
}
