package com.cineverse.dto;

import java.util.List;

public class DashboardStatsDto {
    private Long totalContent;
    private Long totalMovies;
    private Long totalSeries;
    private Long totalSpecials;
    private Long totalUpcoming;
    private Long totalFranchises;
    private Long totalUniverses;
    private Long totalUsers;
    private Long pendingUpdatesCount;

    private List<AuditLogDto> recentChanges;
    private List<PendingChangeDto> pendingApprovals;
    private List<ContentSummaryDto> upcomingReleases;

    public DashboardStatsDto() {}

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

    public Long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(Long totalUsers) { this.totalUsers = totalUsers; }

    public Long getPendingUpdatesCount() { return pendingUpdatesCount; }
    public void setPendingUpdatesCount(Long pendingUpdatesCount) { this.pendingUpdatesCount = pendingUpdatesCount; }

    public List<AuditLogDto> getRecentChanges() { return recentChanges; }
    public void setRecentChanges(List<AuditLogDto> recentChanges) { this.recentChanges = recentChanges; }

    public List<PendingChangeDto> getPendingApprovals() { return pendingApprovals; }
    public void setPendingApprovals(List<PendingChangeDto> pendingApprovals) { this.pendingApprovals = pendingApprovals; }

    public List<ContentSummaryDto> getUpcomingReleases() { return upcomingReleases; }
    public void setUpcomingReleases(List<ContentSummaryDto> upcomingReleases) { this.upcomingReleases = upcomingReleases; }
}
