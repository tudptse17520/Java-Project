package vn.edu.ut.pbms.service;

import vn.edu.ut.pbms.dto.request.SystemConfigRequest;
import vn.edu.ut.pbms.dto.response.SystemConfigListResponse;
import vn.edu.ut.pbms.dto.response.SystemConfigUpdateResponse;

/**
 * Service interface for managing system configurations.
 */
public interface SystemConfigService {
    SystemConfigListResponse getConfigurations(String keyword);
    SystemConfigUpdateResponse updateConfiguration(int id, SystemConfigRequest request);
}
