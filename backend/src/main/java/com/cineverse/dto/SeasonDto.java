package com.cineverse.dto;

import java.util.List;

public class SeasonDto {
    private Long id;
    private Long contentId;
    private Integer seasonNumber;
    private String title;
    private Integer episodeCount;
    private Integer releaseYear;
    private String posterUrl;
    private List<EpisodeDto> episodes;
    private Integer watchedEpisodeCount;

    public SeasonDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getContentId() { return contentId; }
    public void setContentId(Long contentId) { this.contentId = contentId; }

    public Integer getSeasonNumber() { return seasonNumber; }
    public void setSeasonNumber(Integer seasonNumber) { this.seasonNumber = seasonNumber; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Integer getEpisodeCount() { return episodeCount; }
    public void setEpisodeCount(Integer episodeCount) { this.episodeCount = episodeCount; }

    public Integer getReleaseYear() { return releaseYear; }
    public void setReleaseYear(Integer releaseYear) { this.releaseYear = releaseYear; }

    public String getPosterUrl() { return posterUrl; }
    public void setPosterUrl(String posterUrl) { this.posterUrl = posterUrl; }

    public List<EpisodeDto> getEpisodes() { return episodes; }
    public void setEpisodes(List<EpisodeDto> episodes) { this.episodes = episodes; }

    public Integer getWatchedEpisodeCount() { return watchedEpisodeCount; }
    public void setWatchedEpisodeCount(Integer watchedEpisodeCount) { this.watchedEpisodeCount = watchedEpisodeCount; }
}
