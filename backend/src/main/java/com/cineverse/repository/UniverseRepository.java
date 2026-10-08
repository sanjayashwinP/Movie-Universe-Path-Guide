package com.cineverse.repository;

import com.cineverse.model.entity.Universe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UniverseRepository extends JpaRepository<Universe, Long> {
    Optional<Universe> findBySlug(String slug);
    List<Universe> findByFranchiseIdOrderByDisplayOrderAsc(Long franchiseId);
    List<Universe> findByFranchiseSlugOrderByDisplayOrderAsc(String franchiseSlug);
}
