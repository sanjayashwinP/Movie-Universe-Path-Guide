package com.cineverse.repository;

import com.cineverse.model.entity.Franchise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FranchiseRepository extends JpaRepository<Franchise, Long> {
    Optional<Franchise> findBySlug(String slug);
    List<Franchise> findByIsActiveTrueOrderByDisplayOrderAsc();
    boolean existsBySlug(String slug);
}
