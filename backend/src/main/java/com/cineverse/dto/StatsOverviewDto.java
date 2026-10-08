package com.cineverse.dto;

public class StatsOverviewDto {
    private Long totalContent;
    private Long totalMovies;
    private Long totalSeries;
    private Long totalSpecials;
    private Long totalUpcoming;
    private Long totalFranchises;
    private Long totalUniverses;

    public StatsOverviewDto() {}

    public Long getTotalContent() { return totalContent; }
    public void setTotalContent(Long totalContent) { this.totalContent = totalContent; }

    public Long getTotalMovies() { return totalMovies; }
    public void setTotalMovies(Long totalMovies) { this.totalMovies = totalMovies; }

    public Long getTotalSeries() { return totalSeries; }
    public void setTotalSeries(Long totalSeries) { this.totalSeries = totalSeries; }

    public Long getTotalSpecials() { return totalSpecials; }
    public void setTotalSpecials(Long totalSpecials) { this.totalSpecials = totalSpecials; }

    public Long getTotalUpcoming() { return totalUpcoming; }
    public void setTotalUpcoming(Long totalUpcoming) { this.totalUpcoming = totalUpcoming; }

    public Long getTotalFranchises() { return totalFranchises; }
    public void setTotalFranchises(Long totalFranchises) { this.totalFranchises = totalFranchises; }

    public Long getTotalUniverses() { return totalUniverses; }
    public void setTotalUniverses(Long totalUniverses) { this.totalUniverses = totalUniverses; }
}
