package com.cineverse.repository;

import com.cineverse.model.entity.Content;
import com.cineverse.model.enums.ContentStatus;
import com.cineverse.model.enums.ContentType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContentRepository extends JpaRepository<Content, Long>, JpaSpecificationExecutor<Content> {

    Optional<Content> findBySlug(String slug);

    List<Content> findByTitleContainingIgnoreCase(String title);

    boolean existsBySlug(String slug);

    @Query("SELECT c FROM Content c WHERE c.isPublished = true AND (c.releaseDate IS NULL OR c.releaseDate > CURRENT_DATE) AND c.status NOT IN ('RELEASED', 'CANCELLED') ORDER BY c.releaseDate ASC NULLS LAST, c.releaseYear ASC NULLS LAST")
    List<Content> findUpcomingContent(Pageable pageable);

    @Query("SELECT c FROM Content c WHERE c.isPublished = true AND (c.status = 'RELEASED' OR (c.releaseDate IS NOT NULL AND c.releaseDate <= CURRENT_DATE)) ORDER BY c.releaseDate DESC NULLS LAST, c.releaseYear DESC NULLS LAST")
    List<Content> findRecentReleases(Pageable pageable);

    @Query("SELECT c FROM Content c " +
           "LEFT JOIN c.universe u " +
           "LEFT JOIN c.saga s " +
           "WHERE c.isPublished = true AND (" +
           ":keyword IS NULL OR :keyword = '' OR " +
           "LOWER(c.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.originalTitle) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.slug) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.castMembers) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.director) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.genres) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.shortSynopsis) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "(u IS NOT NULL AND (LOWER(u.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(u.designation) LIKE LOWER(CONCAT('%', :keyword, '%')))) OR " +
           "(s IS NOT NULL AND LOWER(s.name) LIKE LOWER(CONCAT('%', :keyword, '%')))" +
           ")")
    Page<Content> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    // Watch Orders
    @Query("SELECT c FROM Content c WHERE c.isPublished = true " +
           "AND (:franchiseId IS NULL OR c.franchise.id = :franchiseId) " +
           "AND (:universeId IS NULL OR c.universe.id = :universeId) " +
           "ORDER BY c.releaseDate ASC NULLS LAST, c.releaseOrderNum ASC NULLS LAST")
    Page<Content> findByReleaseOrder(@Param("franchiseId") Long franchiseId, @Param("universeId") Long universeId, Pageable pageable);

    @Query("SELECT c FROM Content c WHERE c.isPublished = true " +
           "AND (:franchiseId IS NULL OR c.franchise.id = :franchiseId) " +
           "AND (:universeId IS NULL OR c.universe.id = :universeId) " +
           "ORDER BY c.chronologicalOrderNum ASC NULLS LAST, c.releaseDate ASC NULLS LAST")
    Page<Content> findByChronologicalOrder(@Param("franchiseId") Long franchiseId, @Param("universeId") Long universeId, Pageable pageable);

    @Query("SELECT c FROM Content c WHERE c.isPublished = true AND c.timeline.id = :timelineId " +
           "ORDER BY c.timelineOrderNum ASC NULLS LAST, c.releaseDate ASC NULLS LAST")
    Page<Content> findByTimelineOrder(@Param("timelineId") Long timelineId, Pageable pageable);

    @Query("SELECT c FROM Content c WHERE c.isPublished = true " +
           "AND (:universeId IS NULL OR c.universe.id = :universeId) " +
           "AND c.timeline.isMainTimeline = true " +
           "ORDER BY c.chronologicalOrderNum ASC NULLS LAST, c.releaseDate ASC NULLS LAST")
    Page<Content> findByMainTimelineOrder(@Param("universeId") Long universeId, Pageable pageable);

    @Query("SELECT c FROM Content c WHERE c.isPublished = true AND c.saga.id = :sagaId " +
           "ORDER BY c.phase.phaseNumber ASC NULLS LAST, c.releaseOrderNum ASC NULLS LAST, c.releaseDate ASC NULLS LAST")
    List<Content> findBySagaId(@Param("sagaId") Long sagaId);

    @Query("SELECT c FROM Content c WHERE c.isPublished = true AND c.phase.id = :phaseId " +
           "ORDER BY c.releaseOrderNum ASC NULLS LAST, c.releaseDate ASC NULLS LAST")
    List<Content> findByPhaseId(@Param("phaseId") Long phaseId);

    // Counts
    Long countByFranchiseId(Long franchiseId);
    Long countByUniverseId(Long universeId);
    Long countByTimelineId(Long timelineId);
    Long countBySagaId(Long sagaId);
    Long countByPhaseId(Long phaseId);
    Long countByContentType(ContentType contentType);
    Long countByStatus(ContentStatus status);
}
