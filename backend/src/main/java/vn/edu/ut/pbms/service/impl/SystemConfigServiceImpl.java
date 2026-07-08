package vn.edu.ut.pbms.service.impl;

import org.springframework.stereotype.Service;
import vn.edu.ut.pbms.dto.request.SystemConfigRequest;
import vn.edu.ut.pbms.dto.response.SystemConfigListResponse;
import vn.edu.ut.pbms.dto.response.SystemConfigUpdateResponse;
import vn.edu.ut.pbms.service.SystemConfigService;

import java.util.Collections;

/**
 * Service implementation for managing system configurations (Stub implementation).
 */
@Service
public class SystemConfigServiceImpl implements SystemConfigService {

    @Override
    public SystemConfigListResponse getConfigurations(String keyword) {
        return SystemConfigListResponse.builder()
                .totalItems(0)
                .data(Collections.emptyList())
                .message("Mock configurations list (Pending repository implementation)")
                .build();
    }

    @Override
    public SystemConfigUpdateResponse updateConfiguration(int id, SystemConfigRequest request) {
        return SystemConfigUpdateResponse.builder()
                .id(id)
                .message("Mock configuration updated successfully (Pending repository implementation)")
                .build();
    }
}
