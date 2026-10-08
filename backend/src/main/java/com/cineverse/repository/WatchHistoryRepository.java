package com.cineverse.repository;

import com.cineverse.model.entity.WatchHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WatchHistoryRepository extends JpaRepository<WatchHistory, Long> {
    Optional<WatchHistory> findByUserIdAndContentId(Long userId, Long contentId);
    Page<WatchHistory> findByUserIdOrderByWatchedAtDesc(Long userId, Pageable pageable);
    List<WatchHistory> findByUserId(Long userId);
    boolean existsByUserIdAndContentId(Long userId, Long contentId);
    void deleteByUserIdAndContentId(Long userId, Long contentId);

    @Query("SELECT wh.content.id FROM WatchHistory wh WHERE wh.user.id = :userId")
    List<Long> findWatchedContentIdsByUserId(@Param("userId") Long userId);

    @Query("SELECT count(wh) FROM WatchHistory wh WHERE wh.user.id = :userId")
    Long countByUserId(@Param("userId") Long userId);
}
