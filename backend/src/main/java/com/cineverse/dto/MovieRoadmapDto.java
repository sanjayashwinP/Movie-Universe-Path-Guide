package com.cineverse.dto;

import java.util.List;

public class MovieRoadmapDto {
    private ContentSummaryDto targetMovie;
    private Integer totalSteps;
    private Integer totalWatchTimeMinutes;
    private Integer totalWatchedSteps;
    private Integer completionPercentage;
    private String roadmapType;
    private String narrativeSummary;
    private List<RoadmapStepDto> steps;

    public MovieRoadmapDto() {
    }

    public ContentSummaryDto getTargetMovie() {
        return targetMovie;
    }

    public void setTargetMovie(ContentSummaryDto targetMovie) {
        this.targetMovie = targetMovie;
    }

    public Integer getTotalSteps() {
        return totalSteps;
    }

    public void setTotalSteps(Integer totalSteps) {
        this.totalSteps = totalSteps;
    }

    public Integer getTotalWatchTimeMinutes() {
        return totalWatchTimeMinutes;
    }

    public void setTotalWatchTimeMinutes(Integer totalWatchTimeMinutes) {
        this.totalWatchTimeMinutes = totalWatchTimeMinutes;
    }

    public Integer getTotalWatchedSteps() {
        return totalWatchedSteps;
    }

    public void setTotalWatchedSteps(Integer totalWatchedSteps) {
        this.totalWatchedSteps = totalWatchedSteps;
    }

    public Integer getCompletionPercentage() {
        return completionPercentage;
    }

    public void setCompletionPercentage(Integer completionPercentage) {
        this.completionPercentage = completionPercentage;
    }

    public String getRoadmapType() {
        return roadmapType;
    }

    public void setRoadmapType(String roadmapType) {
        this.roadmapType = roadmapType;
    }

    public String getNarrativeSummary() {
        return narrativeSummary;
    }

    public void setNarrativeSummary(String narrativeSummary) {
        this.narrativeSummary = narrativeSummary;
    }

    public List<RoadmapStepDto> getSteps() {
        return steps;
    }

    public void setSteps(List<RoadmapStepDto> steps) {
        this.steps = steps;
    }
}
