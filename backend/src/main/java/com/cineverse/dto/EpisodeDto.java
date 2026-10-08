package com.cineverse.dto;

import java.time.LocalDate;

public class EpisodeDto {
    private Long id;
    private Long seasonId;
    private Integer episodeNumber;
    private String title;
    private Integer runtimeMinutes;
    private LocalDate releaseDate;
    private String synopsis;
    private String stillUrl;
    private Boolean isWatched = false;

    public EpisodeDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getSeasonId() { return seasonId; }
    public void setSeasonId(Long seasonId) { this.seasonId = seasonId; }

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

    public Boolean getIsWatched() { return isWatched; }
    public void setIsWatched(Boolean isWatched) { this.isWatched = isWatched; }
}
