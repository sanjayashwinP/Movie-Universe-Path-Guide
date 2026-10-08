package com.cineverse.model.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "phases")
public class Phase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "saga_id", nullable = false)
    private Saga saga;

    @Column(nullable = false, length = 100)
    private String name; // e.g. "Phase One", "Phase Two", "Phase Three", "Phase Four"

    @Column(nullable = false, length = 100)
    private String slug;

    @Column(name = "phase_number", nullable = false)
    private Integer phaseNumber = 1;

    @Column(columnDefinition = "TEXT")
    private String description;

    public Phase() {}

    public Phase(Saga saga, String name, String slug, Integer phaseNumber, String description) {
        this.saga = saga;
        this.name = name;
        this.slug = slug;
        this.phaseNumber = phaseNumber;
        this.description = description;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Saga getSaga() { return saga; }
    public void setSaga(Saga saga) { this.saga = saga; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public Integer getPhaseNumber() { return phaseNumber; }
    public void setPhaseNumber(Integer phaseNumber) { this.phaseNumber = phaseNumber; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
