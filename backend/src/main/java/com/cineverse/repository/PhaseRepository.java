package com.cineverse.repository;

import com.cineverse.model.entity.Phase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PhaseRepository extends JpaRepository<Phase, Long> {
    Optional<Phase> findBySlug(String slug);
    List<Phase> findBySagaIdOrderByPhaseNumberAsc(Long sagaId);
    List<Phase> findBySagaSlugOrderByPhaseNumberAsc(String sagaSlug);
}
