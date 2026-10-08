package com.cineverse.repository;

import com.cineverse.model.entity.PlatformAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlatformAvailabilityRepository extends JpaRepository<PlatformAvailability, Long> {
    List<PlatformAvailability> findByContentId(Long contentId);
    List<PlatformAvailability> findByContentIdAndCountryCode(Long contentId, String countryCode);
}
