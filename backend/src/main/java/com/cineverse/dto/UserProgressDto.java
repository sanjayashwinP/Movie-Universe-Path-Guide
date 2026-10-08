package com.cineverse.dto;

import java.util.HashMap;
import java.util.Map;

public class UserProgressDto {
    private Long totalContentAvailable;
    private Long totalWatched;
    private Long totalUnwatched;
    private Long moviesWatched;
    private Long seriesWatched;
    private Long episodesWatched;
    private Long specialsWatched;
    private Long totalWatchTimeMinutes;
    private Double overallCompletionPercentage;

    private String favoriteUniverse;
    private String favoriteSaga;

    // Saga and Universe completion breakdown maps
    private Map<String, Double> completionBySaga = new HashMap<>();
    private Map<String, Double> completionByUniverse = new HashMap<>();
    private Map<String, Double> completionByFranchise = new HashMap<>();

    public UserProgressDto() {}

    public Long getTotalContentAvailable() { return totalContentAvailable; }
    public void setTotalContentAvailable(Long totalContentAvailable) { this.totalContentAvailable = totalContentAvailable; }

    public Long getTotalWatched() { return totalWatched; }
    public void setTotalWatched(Long totalWatched) { this.totalWatched = totalWatched; }

    public Long getTotalUnwatched() { return totalUnwatched; }
    public void setTotalUnwatched(Long totalUnwatched) { this.totalUnwatched = totalUnwatched; }

    public Long getMoviesWatched() { return moviesWatched; }
    public void setMoviesWatched(Long moviesWatched) { this.moviesWatched = moviesWatched; }

    public Long getSeriesWatched() { return seriesWatched; }
    public void setSeriesWatched(Long seriesWatched) { this.seriesWatched = seriesWatched; }

    public Long getEpisodesWatched() { return episodesWatched; }
    public void setEpisodesWatched(Long episodesWatched) { this.episodesWatched = episodesWatched; }

    public Long getSpecialsWatched() { return specialsWatched; }
    public void setSpecialsWatched(Long specialsWatched) { this.specialsWatched = specialsWatched; }

    public Long getTotalWatchTimeMinutes() { return totalWatchTimeMinutes; }
    public void setTotalWatchTimeMinutes(Long totalWatchTimeMinutes) { this.totalWatchTimeMinutes = totalWatchTimeMinutes; }

    public Double getOverallCompletionPercentage() { return overallCompletionPercentage; }
    public void setOverallCompletionPercentage(Double overallCompletionPercentage) { this.overallCompletionPercentage = overallCompletionPercentage; }

    public String getFavoriteUniverse() { return favoriteUniverse; }
    public void setFavoriteUniverse(String favoriteUniverse) { this.favoriteUniverse = favoriteUniverse; }

    public String getFavoriteSaga() { return favoriteSaga; }
    public void setFavoriteSaga(String favoriteSaga) { this.favoriteSaga = favoriteSaga; }

    public Map<String, Double> getCompletionBySaga() { return completionBySaga; }
    public void setCompletionBySaga(Map<String, Double> completionBySaga) { this.completionBySaga = completionBySaga; }

    public Map<String, Double> getCompletionByUniverse() { return completionByUniverse; }
    public void setCompletionByUniverse(Map<String, Double> completionByUniverse) { this.completionByUniverse = completionByUniverse; }

    public Map<String, Double> getCompletionByFranchise() { return completionByFranchise; }
    public void setCompletionByFranchise(Map<String, Double> completionByFranchise) { this.completionByFranchise = completionByFranchise; }
}
