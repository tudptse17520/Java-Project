package vn.edu.ut.pbms.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.ut.pbms.dto.request.SystemConfigRequest;
import vn.edu.ut.pbms.dto.response.SystemConfigListResponse;
import vn.edu.ut.pbms.dto.response.SystemConfigUpdateResponse;
import vn.edu.ut.pbms.service.SystemConfigService;

/**
 * REST Controller for managing system configurations.
 */
@RestController
@RequestMapping("/api/v1/configurations")
@RequiredArgsConstructor
@CrossOrigin
public class ParkingConfigurationController {

    private final SystemConfigService systemConfigService;

    /**
     * Retrieve system configurations.
     *
     * @param keyword optional search keyword matching config key or description
     * @return 200 OK with SystemConfigListResponse
     */
    @GetMapping
    public ResponseEntity<SystemConfigListResponse> getConfigurations(
            @RequestParam(value = "keyword", required = false) String keyword) {
        SystemConfigListResponse response = systemConfigService.getConfigurations(keyword);
        return ResponseEntity.ok(response);
    }

    /**
     * Update an existing configuration.
     *
     * @param id      ID of the configuration parameter to update
     * @param request updated configuration fields
     * @return 200 OK with SystemConfigUpdateResponse
     */
    @PutMapping("/{id}")
    public ResponseEntity<SystemConfigUpdateResponse> updateConfiguration(
            @PathVariable("id") int id,
            @Valid @RequestBody SystemConfigRequest request) {
        SystemConfigUpdateResponse response = systemConfigService.updateConfiguration(id, request);
        return ResponseEntity.ok(response);
    }
}
