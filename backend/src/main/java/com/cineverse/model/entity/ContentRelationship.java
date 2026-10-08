package com.cineverse.model.entity;

import com.cineverse.model.enums.RelationshipType;
import jakarta.persistence.*;

@Entity
@Table(name = "content_relationships", indexes = {
    @Index(name = "idx_rel_source", columnList = "source_content_id"),
    @Index(name = "idx_rel_target", columnList = "target_content_id")
})
public class ContentRelationship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_content_id", nullable = false)
    private Content sourceContent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_content_id", nullable = false)
    private Content targetContent;

    @Enumerated(EnumType.STRING)
    @Column(name = "relationship_type", nullable = false, length = 30)
    private RelationshipType relationshipType;

    @Column(length = 255)
    private String notes;

    public ContentRelationship() {}

    public ContentRelationship(Content sourceContent, Content targetContent, RelationshipType relationshipType, String notes) {
        this.sourceContent = sourceContent;
        this.targetContent = targetContent;
        this.relationshipType = relationshipType;
        this.notes = notes;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Content getSourceContent() { return sourceContent; }
    public void setSourceContent(Content sourceContent) { this.sourceContent = sourceContent; }

    public Content getTargetContent() { return targetContent; }
    public void setTargetContent(Content targetContent) { this.targetContent = targetContent; }

    public RelationshipType getRelationshipType() { return relationshipType; }
    public void setRelationshipType(RelationshipType relationshipType) { this.relationshipType = relationshipType; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
