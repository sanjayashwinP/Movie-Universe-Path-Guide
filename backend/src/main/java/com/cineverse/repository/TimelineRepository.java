package com.cineverse.repository;

import com.cineverse.model.entity.Timeline;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TimelineRepository extends JpaRepository<Timeline, Long> {
    Optional<Timeline> findBySlug(String slug);
    List<Timeline> findByUniverseIdOrderByDisplayOrderAsc(Long universeId);
    List<Timeline> findByUniverseSlugOrderByDisplayOrderAsc(String universeSlug);
    Optional<Timeline> findByUniverseIdAndIsMainTimelineTrue(Long universeId);
}
