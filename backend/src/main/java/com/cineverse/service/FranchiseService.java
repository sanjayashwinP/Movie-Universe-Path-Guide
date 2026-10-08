package com.cineverse.service;

import com.cineverse.dto.*;
import com.cineverse.exception.ResourceNotFoundException;
import com.cineverse.model.entity.*;
import com.cineverse.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FranchiseService {

    private final FranchiseRepository franchiseRepository;
    private final UniverseRepository universeRepository;
    private final TimelineRepository timelineRepository;
    private final SagaRepository sagaRepository;
    private final PhaseRepository phaseRepository;
    private final ContentRepository contentRepository;

    public FranchiseService(FranchiseRepository franchiseRepository,
                            UniverseRepository universeRepository,
                            TimelineRepository timelineRepository,
                            SagaRepository sagaRepository,
                            PhaseRepository phaseRepository,
                            ContentRepository contentRepository) {
        this.franchiseRepository = franchiseRepository;
        this.universeRepository = universeRepository;
        this.timelineRepository = timelineRepository;
        this.sagaRepository = sagaRepository;
        this.phaseRepository = phaseRepository;
        this.contentRepository = contentRepository;
    }

    @Transactional(readOnly = true)
    public List<FranchiseDto> getAllFranchises() {
        return franchiseRepository.findByIsActiveTrueOrderByDisplayOrderAsc()
                .stream().map(this::toFranchiseDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public FranchiseDto getFranchiseBySlug(String slug) {
        Franchise franchise = franchiseRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Franchise not found: " + slug));
        return toFranchiseDto(franchise);
    }

    @Transactional(readOnly = true)
    public List<UniverseDto> getUniverses(Long franchiseId) {
        List<Universe> universes = franchiseId != null ?
                universeRepository.findByFranchiseIdOrderByDisplayOrderAsc(franchiseId) :
                universeRepository.findAll();
        return universes.stream().map(this::toUniverseDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TimelineDto> getTimelines(Long universeId) {
        List<Timeline> timelines = universeId != null ?
                timelineRepository.findByUniverseIdOrderByDisplayOrderAsc(universeId) :
                timelineRepository.findAll();
        return timelines.stream().map(this::toTimelineDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SagaDto> getSagas(Long franchiseId) {
        List<Saga> sagas = franchiseId != null ?
                sagaRepository.findByFranchiseIdOrderByOrderIndexAsc(franchiseId) :
                sagaRepository.findAll();
        return sagas.stream().map(this::toSagaDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PhaseDto> getPhases(Long sagaId) {
        List<Phase> phases = sagaId != null ?
                phaseRepository.findBySagaIdOrderByPhaseNumberAsc(sagaId) :
                phaseRepository.findAll();
        return phases.stream().map(this::toPhaseDto).collect(Collectors.toList());
    }

    public FranchiseDto toFranchiseDto(Franchise f) {
        FranchiseDto dto = new FranchiseDto();
        dto.setId(f.getId());
        dto.setName(f.getName());
        dto.setSlug(f.getSlug());
        dto.setDescription(f.getDescription());
        dto.setBannerUrl(f.getBannerUrl());
        dto.setLogoUrl(f.getLogoUrl());
        dto.setDisplayOrder(f.getDisplayOrder());
        dto.setIsActive(f.getIsActive());
        if (f.getUniverses() != null) {
            dto.setUniverses(f.getUniverses().stream().map(this::toUniverseDto).collect(Collectors.toList()));
        }
        if (f.getSagas() != null) {
            dto.setSagas(f.getSagas().stream().map(this::toSagaDto).collect(Collectors.toList()));
        }
        return dto;
    }

    public UniverseDto toUniverseDto(Universe u) {
        UniverseDto dto = new UniverseDto();
        dto.setId(u.getId());
        dto.setFranchiseId(u.getFranchise() != null ? u.getFranchise().getId() : null);
        dto.setFranchiseName(u.getFranchise() != null ? u.getFranchise().getName() : null);
        dto.setName(u.getName());
        dto.setSlug(u.getSlug());
        dto.setDesignation(u.getDesignation());
        dto.setDescription(u.getDescription());
        dto.setBannerUrl(u.getBannerUrl());
        dto.setDisplayOrder(u.getDisplayOrder());
        dto.setContentCount(contentRepository.countByUniverseId(u.getId()));
        if (u.getTimelines() != null) {
            dto.setTimelines(u.getTimelines().stream().map(this::toTimelineDto).collect(Collectors.toList()));
        }
        return dto;
    }

    public TimelineDto toTimelineDto(Timeline t) {
        TimelineDto dto = new TimelineDto();
        dto.setId(t.getId());
        dto.setUniverseId(t.getUniverse() != null ? t.getUniverse().getId() : null);
        dto.setUniverseName(t.getUniverse() != null ? t.getUniverse().getName() : null);
        dto.setName(t.getName());
        dto.setSlug(t.getSlug());
        dto.setIsMainTimeline(t.getIsMainTimeline());
        dto.setBranchPointDescription(t.getBranchPointDescription());
        dto.setDescription(t.getDescription());
        dto.setDisplayOrder(t.getDisplayOrder());
        dto.setContentCount(contentRepository.countByTimelineId(t.getId()));
        return dto;
    }

    public SagaDto toSagaDto(Saga s) {
        SagaDto dto = new SagaDto();
        dto.setId(s.getId());
        dto.setFranchiseId(s.getFranchise() != null ? s.getFranchise().getId() : null);
        dto.setFranchiseName(s.getFranchise() != null ? s.getFranchise().getName() : null);
        dto.setName(s.getName());
        dto.setSlug(s.getSlug());
        dto.setOrderIndex(s.getOrderIndex());
        dto.setDescription(s.getDescription());
        dto.setPosterUrl(s.getPosterUrl());
        dto.setBannerUrl(s.getBannerUrl());
        dto.setContentCount(contentRepository.countBySagaId(s.getId()));
        if (s.getPhases() != null) {
            dto.setPhases(s.getPhases().stream().map(this::toPhaseDto).collect(Collectors.toList()));
        }
        return dto;
    }

    public PhaseDto toPhaseDto(Phase p) {
        PhaseDto dto = new PhaseDto();
        dto.setId(p.getId());
        dto.setSagaId(p.getSaga() != null ? p.getSaga().getId() : null);
        dto.setSagaName(p.getSaga() != null ? p.getSaga().getName() : null);
        dto.setName(p.getName());
        dto.setSlug(p.getSlug());
        dto.setPhaseNumber(p.getPhaseNumber());
        dto.setDescription(p.getDescription());
        dto.setContentCount(contentRepository.countByPhaseId(p.getId()));
        return dto;
    }
}
