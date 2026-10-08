package com.cineverse.service;

import com.cineverse.dto.AuditLogDto;
import com.cineverse.model.entity.AuditLog;
import com.cineverse.repository.AuditLogRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    public AuditService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional
    public void logChange(String adminUsername, String action, String entityName, Long entityId, String fieldName, String oldValue, String newValue) {
        AuditLog log = new AuditLog(adminUsername, action, entityName, entityId, fieldName, oldValue, newValue);
        auditLogRepository.save(log);
    }

    @Transactional(readOnly = true)
    public Page<AuditLogDto> getAllLogs(Pageable pageable) {
        return auditLogRepository.findAllByOrderByTimestampDesc(pageable)
                .map(this::toDto);
    }

    @Transactional(readOnly = true)
    public List<AuditLogDto> getRecentLogs() {
        return auditLogRepository.findTop20ByOrderByTimestampDesc()
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    public AuditLogDto toDto(AuditLog log) {
        AuditLogDto dto = new AuditLogDto();
        dto.setId(log.getId());
        dto.setAdminUsername(log.getAdminUsername());
        dto.setAction(log.getAction());
        dto.setEntityName(log.getEntityName());
        dto.setEntityId(log.getEntityId());
        dto.setFieldName(log.getFieldName());
        dto.setOldValue(log.getOldValue());
        dto.setNewValue(log.getNewValue());
        dto.setTimestamp(log.getTimestamp());
        return dto;
    }
}
