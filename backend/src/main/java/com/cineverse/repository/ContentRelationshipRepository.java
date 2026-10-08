package com.cineverse.repository;

import com.cineverse.model.entity.ContentRelationship;
import com.cineverse.model.enums.RelationshipType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContentRelationshipRepository extends JpaRepository<ContentRelationship, Long> {

    // Items that must be watched BEFORE targetContent (targetContent is target, sourceContent is prerequisite)
    @Query("SELECT r FROM ContentRelationship r WHERE r.targetContent.id = :contentId AND r.relationshipType IN ('PREREQUISITE', 'PREQUEL', 'SEQUEL', 'NEXT_WATCH')")
    List<ContentRelationship> findWatchBeforeByContentId(@Param("contentId") Long contentId);

    // Items to watch AFTER sourceContent (sourceContent is source, targetContent is next watch/sequel)
    @Query("SELECT r FROM ContentRelationship r WHERE r.sourceContent.id = :contentId AND r.relationshipType IN ('NEXT_WATCH', 'SEQUEL')")
    List<ContentRelationship> findWatchAfterByContentId(@Param("contentId") Long contentId);

    // All related items for a content
    @Query("SELECT r FROM ContentRelationship r WHERE r.sourceContent.id = :contentId OR r.targetContent.id = :contentId")
    List<ContentRelationship> findAllRelationshipsByContentId(@Param("contentId") Long contentId);

    List<ContentRelationship> findBySourceContentIdAndRelationshipType(Long sourceContentId, RelationshipType type);
}
