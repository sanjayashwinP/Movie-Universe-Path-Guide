package com.cineverse.dto;

public class WhereDoesThisFitDto {
    private String franchiseName;
    private String universeName;
    private String universeDesignation;
    private String timelineName;
    private Boolean isMainTimeline;
    private String sagaName;
    private String phaseName;
    private Integer releaseOrderNum;
    private Integer chronologicalOrderNum;
    private Integer timelineOrderNum;
    private String contextExplanation;

    public WhereDoesThisFitDto() {}

    public WhereDoesThisFitDto(String franchiseName, String universeName, String universeDesignation,
                               String timelineName, Boolean isMainTimeline, String sagaName,
                               String phaseName, Integer releaseOrderNum, Integer chronologicalOrderNum,
                               Integer timelineOrderNum, String contextExplanation) {
        this.franchiseName = franchiseName;
        this.universeName = universeName;
        this.universeDesignation = universeDesignation;
        this.timelineName = timelineName;
        this.isMainTimeline = isMainTimeline;
        this.sagaName = sagaName;
        this.phaseName = phaseName;
        this.releaseOrderNum = releaseOrderNum;
        this.chronologicalOrderNum = chronologicalOrderNum;
        this.timelineOrderNum = timelineOrderNum;
        this.contextExplanation = contextExplanation;
    }

    public String getFranchiseName() { return franchiseName; }
    public void setFranchiseName(String franchiseName) { this.franchiseName = franchiseName; }

    public String getUniverseName() { return universeName; }
    public void setUniverseName(String universeName) { this.universeName = universeName; }

    public String getUniverseDesignation() { return universeDesignation; }
    public void setUniverseDesignation(String universeDesignation) { this.universeDesignation = universeDesignation; }

    public String getTimelineName() { return timelineName; }
    public void setTimelineName(String timelineName) { this.timelineName = timelineName; }

    public Boolean getIsMainTimeline() { return isMainTimeline; }
    public void setIsMainTimeline(Boolean isMainTimeline) { this.isMainTimeline = isMainTimeline; }

    public String getSagaName() { return sagaName; }
    public void setSagaName(String sagaName) { this.sagaName = sagaName; }

    public String getPhaseName() { return phaseName; }
    public void setPhaseName(String phaseName) { this.phaseName = phaseName; }

    public Integer getReleaseOrderNum() { return releaseOrderNum; }
    public void setReleaseOrderNum(Integer releaseOrderNum) { this.releaseOrderNum = releaseOrderNum; }

    public Integer getChronologicalOrderNum() { return chronologicalOrderNum; }
    public void setChronologicalOrderNum(Integer chronologicalOrderNum) { this.chronologicalOrderNum = chronologicalOrderNum; }

    public Integer getTimelineOrderNum() { return timelineOrderNum; }
    public void setTimelineOrderNum(Integer timelineOrderNum) { this.timelineOrderNum = timelineOrderNum; }

    public String getContextExplanation() { return contextExplanation; }
    public void setContextExplanation(String contextExplanation) { this.contextExplanation = contextExplanation; }
}
