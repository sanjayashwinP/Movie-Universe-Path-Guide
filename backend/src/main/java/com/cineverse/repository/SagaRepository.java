package com.cineverse.repository;

import com.cineverse.model.entity.Saga;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SagaRepository extends JpaRepository<Saga, Long> {
    Optional<Saga> findBySlug(String slug);
    List<Saga> findByFranchiseIdOrderByOrderIndexAsc(Long franchiseId);
    List<Saga> findByFranchiseSlugOrderByOrderIndexAsc(String franchiseSlug);
}
