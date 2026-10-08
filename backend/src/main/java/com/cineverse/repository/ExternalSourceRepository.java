package com.cineverse.repository;

import com.cineverse.model.entity.ExternalSource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExternalSourceRepository extends JpaRepository<ExternalSource, Long> {
    List<ExternalSource> findByIsActiveTrue();
}
