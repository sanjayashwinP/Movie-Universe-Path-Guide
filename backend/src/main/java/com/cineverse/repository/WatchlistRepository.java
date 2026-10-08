package com.cineverse.repository;

import com.cineverse.model.entity.Watchlist;
import com.cineverse.model.enums.WatchlistStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WatchlistRepository extends JpaRepository<Watchlist, Long> {
    Optional<Watchlist> findByUserIdAndContentId(Long userId, Long contentId);
    Page<Watchlist> findByUserId(Long userId, Pageable pageable);
    Page<Watchlist> findByUserIdAndStatus(Long userId, WatchlistStatus status, Pageable pageable);
    List<Watchlist> findByUserId(Long userId);
    boolean existsByUserIdAndContentId(Long userId, Long contentId);
    void deleteByUserIdAndContentId(Long userId, Long contentId);
}
