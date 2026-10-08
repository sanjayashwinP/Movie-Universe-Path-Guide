package com.cineverse.dto;

import com.cineverse.model.enums.WatchlistStatus;
import jakarta.validation.constraints.NotNull;

public class WatchlistRequest {
    @NotNull(message = "Status is required")
    private WatchlistStatus status;

    private Integer userRating;
    private String notes;

    public WatchlistRequest() {}

    public WatchlistRequest(WatchlistStatus status, Integer userRating, String notes) {
        this.status = status;
        this.userRating = userRating;
        this.notes = notes;
    }

    public WatchlistStatus getStatus() { return status; }
    public void setStatus(WatchlistStatus status) { this.status = status; }

    public Integer getUserRating() { return userRating; }
    public void setUserRating(Integer userRating) { this.userRating = userRating; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
