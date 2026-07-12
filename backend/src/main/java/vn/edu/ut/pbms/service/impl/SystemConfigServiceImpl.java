package vn.edu.ut.pbms.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.edu.ut.pbms.dto.request.SystemConfigRequest;
import vn.edu.ut.pbms.dto.response.SystemConfigListResponse;
import vn.edu.ut.pbms.dto.response.SystemConfigResponse;
import vn.edu.ut.pbms.dto.response.SystemConfigUpdateResponse;
import vn.edu.ut.pbms.entity.SystemConfig;
import vn.edu.ut.pbms.repository.SystemConfigRepository;
import vn.edu.ut.pbms.service.SystemConfigService;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service implementation for managing system configurations.
 */
@Service
@RequiredArgsConstructor
public class SystemConfigServiceImpl implements SystemConfigService {

    private final SystemConfigRepository systemConfigRepository;

    @Override
    public SystemConfigListResponse getConfigurations(String keyword) {
        List<SystemConfig> configs;
        if (keyword != null && !keyword.trim().isEmpty()) {
            configs = systemConfigRepository.searchByKeyword(keyword.trim());
        } else {
            configs = systemConfigRepository.findAll();
        }

        List<SystemConfigResponse> responseData = configs.stream().map(this::mapToResponse).collect(Collectors.toList());

        return SystemConfigListResponse.builder()
                .totalItems(responseData.size())
                .data(responseData)
                .message("Fetched configurations successfully")
                .build();
    }

    @Override
    @Transactional
    public SystemConfigUpdateResponse updateConfiguration(int id, SystemConfigRequest request) {
        SystemConfig config = systemConfigRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Configuration not found with ID: " + id));

        config.setConfigValue(request.getConfigValue());
        config.setDescription(request.getDescription());
        
        systemConfigRepository.save(config);

        return SystemConfigUpdateResponse.builder()
                .id(id)
                .message("Configuration updated successfully")
                .build();
    }
    
    private SystemConfigResponse mapToResponse(SystemConfig config) {
        return SystemConfigResponse.builder()
                .id(config.getId())
                .configKey(config.getConfigKey())
                .configValue(config.getConfigValue())
                .description(config.getDescription())
                .build();
    }
}
