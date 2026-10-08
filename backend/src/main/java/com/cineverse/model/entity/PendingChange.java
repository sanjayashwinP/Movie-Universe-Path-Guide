package com.cineverse.model.entity;

import com.cineverse.model.enums.ChangeStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "pending_changes")
public class PendingChange {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_id")
    private ExternalSource source;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "content_id")
    private Content content;

    @Column(nullable = false, length = 200)
    private String projectTitle;

    @Column(name = "field_name", nullable = false, length = 100)
    private String fieldName; // e.g. "releaseDate", "status", "title"

    @Column(name = "old_value", columnDefinition = "TEXT")
    private String oldValue;

    @Column(name = "new_value", columnDefinition = "TEXT")
    private String newValue;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ChangeStatus status = ChangeStatus.PENDING;

    @Column(name = "source_reference_url", length = 500)
    private String sourceReferenceUrl;

    @Column(name = "detected_at", nullable = false)
    private LocalDateTime detectedAt = LocalDateTime.now();

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @Column(name = "reviewed_by", length = 50)
    private String reviewedBy;

    public PendingChange() {}

    public PendingChange(ExternalSource source, Content content, String projectTitle, String fieldName, String oldValue, String newValue, String sourceReferenceUrl) {
        this.source = source;
        this.content = content;
        this.projectTitle = projectTitle;
        this.fieldName = fieldName;
        this.oldValue = oldValue;
        this.newValue = newValue;
        this.sourceReferenceUrl = sourceReferenceUrl;
        this.status = ChangeStatus.PENDING;
        this.detectedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ExternalSource getSource() { return source; }
    public void setSource(ExternalSource source) { this.source = source; }

    public Content getContent() { return content; }
    public void setContent(Content content) { this.content = content; }

    public String getProjectTitle() { return projectTitle; }
    public void setProjectTitle(String projectTitle) { this.projectTitle = projectTitle; }

    public String getFieldName() { return fieldName; }
    public void setFieldName(String fieldName) { this.fieldName = fieldName; }

    public String getOldValue() { return oldValue; }
    public void setOldValue(String oldValue) { this.oldValue = oldValue; }

    public String getNewValue() { return newValue; }
    public void setNewValue(String newValue) { this.newValue = newValue; }

    public ChangeStatus getStatus() { return status; }
    public void setStatus(ChangeStatus status) { this.status = status; }

    public String getSourceReferenceUrl() { return sourceReferenceUrl; }
    public void setSourceReferenceUrl(String sourceReferenceUrl) { this.sourceReferenceUrl = sourceReferenceUrl; }

    public LocalDateTime getDetectedAt() { return detectedAt; }
    public void setDetectedAt(LocalDateTime detectedAt) { this.detectedAt = detectedAt; }

    public LocalDateTime getReviewedAt() { return reviewedAt; }
    public void setReviewedAt(LocalDateTime reviewedAt) { this.reviewedAt = reviewedAt; }

    public String getReviewedBy() { return reviewedBy; }
    public void setReviewedBy(String reviewedBy) { this.reviewedBy = reviewedBy; }
}
