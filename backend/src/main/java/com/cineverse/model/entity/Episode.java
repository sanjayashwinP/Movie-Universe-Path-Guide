package com.cineverse.model.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "episodes")
public class Episode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "season_id", nullable = false)
    private Season season;

    @Column(name = "episode_number", nullable = false)
    private Integer episodeNumber;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(name = "runtime_minutes")
    private Integer runtimeMinutes;

    @Column(name = "release_date")
    private LocalDate releaseDate;

    @Column(columnDefinition = "TEXT")
    private String synopsis;

    @Column(name = "still_url", length = 500)
    private String stillUrl;

    public Episode() {}

    public Episode(Season season, Integer episodeNumber, String title, Integer runtimeMinutes, LocalDate releaseDate, String synopsis) {
        this.season = season;
        this.episodeNumber = episodeNumber;
        this.title = title;
        this.runtimeMinutes = runtimeMinutes;
        this.releaseDate = releaseDate;
        this.synopsis = synopsis;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Season getSeason() { return season; }
    public void setSeason(Season season) { this.season = season; }

    public Integer getEpisodeNumber() { return episodeNumber; }
    public void setEpisodeNumber(Integer episodeNumber) { this.episodeNumber = episodeNumber; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Integer getRuntimeMinutes() { return runtimeMinutes; }
    public void setRuntimeMinutes(Integer runtimeMinutes) { this.runtimeMinutes = runtimeMinutes; }

    public LocalDate getReleaseDate() { return releaseDate; }
    public void setReleaseDate(LocalDate releaseDate) { this.releaseDate = releaseDate; }

    public String getSynopsis() { return synopsis; }
    public void setSynopsis(String synopsis) { this.synopsis = synopsis; }

    public String getStillUrl() { return stillUrl; }
    public void setStillUrl(String stillUrl) { this.stillUrl = stillUrl; }
}
