package com.cineverse.repository;

import com.cineverse.model.entity.PendingChange;
import com.cineverse.model.enums.ChangeStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PendingChangeRepository extends JpaRepository<PendingChange, Long> {
    List<PendingChange> findByStatusOrderByDetectedAtDesc(ChangeStatus status);
    Page<PendingChange> findByStatus(ChangeStatus status, Pageable pageable);
    Long countByStatus(ChangeStatus status);
}
