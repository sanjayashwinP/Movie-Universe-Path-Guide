package com.cineverse.dto;

import java.util.List;

public class SeriesProgressDto {
    private Long contentId;
    private String title;
    private Integer totalEpisodes;
    private Integer watchedEpisodes;
    private Integer progressPercentage;
    private EpisodeDto nextUnwatchedEpisode;
    private List<SeasonDto> seasons;

    public SeriesProgressDto() {}

    public Long getContentId() { return contentId; }
    public void setContentId(Long contentId) { this.contentId = contentId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Integer getTotalEpisodes() { return totalEpisodes; }
    public void setTotalEpisodes(Integer totalEpisodes) { this.totalEpisodes = totalEpisodes; }

    public Integer getWatchedEpisodes() { return watchedEpisodes; }
    public void setWatchedEpisodes(Integer watchedEpisodes) { this.watchedEpisodes = watchedEpisodes; }

    public Integer getProgressPercentage() { return progressPercentage; }
    public void setProgressPercentage(Integer progressPercentage) { this.progressPercentage = progressPercentage; }

    public EpisodeDto getNextUnwatchedEpisode() { return nextUnwatchedEpisode; }
    public void setNextUnwatchedEpisode(EpisodeDto nextUnwatchedEpisode) { this.nextUnwatchedEpisode = nextUnwatchedEpisode; }

    public List<SeasonDto> getSeasons() { return seasons; }
    public void setSeasons(List<SeasonDto> seasons) { this.seasons = seasons; }
}
