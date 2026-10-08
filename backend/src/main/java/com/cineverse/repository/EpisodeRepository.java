package com.cineverse.repository;

import com.cineverse.model.entity.Episode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EpisodeRepository extends JpaRepository<Episode, Long> {
    List<Episode> findBySeasonIdOrderByEpisodeNumberAsc(Long seasonId);

    @Query("SELECT e FROM Episode e WHERE e.season.content.id = :contentId ORDER BY e.season.seasonNumber ASC, e.episodeNumber ASC")
    List<Episode> findAllByContentId(@Param("contentId") Long contentId);

    @Query("SELECT count(e) FROM Episode e WHERE e.season.content.id = :contentId")
    Long countByContentId(@Param("contentId") Long contentId);
}
