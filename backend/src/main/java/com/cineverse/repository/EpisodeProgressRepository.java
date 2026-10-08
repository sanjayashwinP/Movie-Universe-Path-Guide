package com.cineverse.repository;

import com.cineverse.model.entity.EpisodeProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EpisodeProgressRepository extends JpaRepository<EpisodeProgress, Long> {
    Optional<EpisodeProgress> findByUserIdAndEpisodeId(Long userId, Long episodeId);
    List<EpisodeProgress> findByUserId(Long userId);

    @Query("SELECT ep FROM EpisodeProgress ep WHERE ep.user.id = :userId AND ep.episode.season.content.id = :contentId")
    List<EpisodeProgress> findByUserIdAndContentId(@Param("userId") Long userId, @Param("contentId") Long contentId);

    @Query("SELECT ep.episode.id FROM EpisodeProgress ep WHERE ep.user.id = :userId AND ep.isWatched = true")
    List<Long> findWatchedEpisodeIdsByUserId(@Param("userId") Long userId);

    @Query("SELECT count(ep) FROM EpisodeProgress ep WHERE ep.user.id = :userId AND ep.isWatched = true")
    Long countWatchedEpisodesByUserId(@Param("userId") Long userId);

    @Query("SELECT count(ep) FROM EpisodeProgress ep WHERE ep.user.id = :userId AND ep.episode.season.content.id = :contentId AND ep.isWatched = true")
    Long countWatchedEpisodesByUserIdAndContentId(@Param("userId") Long userId, @Param("contentId") Long contentId);
}
