package vn.edu.ut.pbms.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.tags.Tag;
import vn.edu.ut.pbms.dto.request.UpdateStatusRequest;
import vn.edu.ut.pbms.dto.request.UserCreateRequest;
import vn.edu.ut.pbms.dto.request.UserUpdateRequest;
import vn.edu.ut.pbms.dto.response.UserListResponse;
import vn.edu.ut.pbms.dto.response.UserResponse;
import vn.edu.ut.pbms.service.UserService;

/**
 * REST Controller for User Management.
 * Base endpoint: /api/v1/users
 *
 * Endpoints:
 * - GET    /api/v1/users                  → Lấy danh sách người dùng (200)
 * - POST   /api/v1/users                  → Tạo người dùng mới (201)
 * - PUT    /api/v1/users/{id}             → Cập nhật thông tin người dùng (200)
 * - PATCH  /api/v1/users/{id}/status      → Cập nhật trạng thái người dùng (200)
 */
@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "User")
public class UserController {

    private final UserService userService;

    // ==================== GET - Lấy danh sách ====================

    /**
     * Retrieve users with optional keyword search and role filter.
     *
     * @param keyword optional partial text to search by fullName or phoneNumber
     * @param role    optional role filter (ADMIN, MANAGER, STAFF, USER)
     * @return HTTP 200 with UserListResponse
     */
    @GetMapping
    public ResponseEntity<UserListResponse> getUsers(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String role) {
        UserListResponse response = userService.getUsers(keyword, role);
        return ResponseEntity.ok(response);
    }

    // ==================== POST - Tạo mới ====================

    /**
     * Create a new user.
     * - Validates input via @Valid + Jakarta annotations
     * - Checks username/phone uniqueness in Service layer
     * - Hashes password via BCrypt
     *
     * @param request the user creation payload (validated)
     * @return HTTP 201 Created with the created UserResponse
     */
    @PostMapping
    public ResponseEntity<UserResponse> createUser(
            @Valid @RequestBody UserCreateRequest request) {
        UserResponse response = userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ==================== PUT - Cập nhật ====================

    /**
     * Update an existing user's profile information.
     * - Validates input via @Valid
     * - Prevents phone duplication with other accounts
     *
     * @param id      the ID of the user to update (path variable)
     * @param request the user update payload (validated)
     * @return HTTP 200 OK with the updated UserResponse
     */
    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable long id,
            @Valid @RequestBody UserUpdateRequest request) {
        UserResponse response = userService.updateUser(id, request);
        return ResponseEntity.ok(response);
    }

    // ==================== PATCH - Cập nhật trạng thái ====================

    /**
     * Update a user's status (ACTIVE/INACTIVE).
     *
     * @param id      the ID of the user to update (path variable)
     * @param request the status update payload (validated)
     * @return HTTP 200 OK with the updated UserResponse
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<UserResponse> updateStatus(
            @PathVariable long id,
            @Valid @RequestBody UpdateStatusRequest request) {
        UserResponse response = userService.updateStatus(id, request);
        return ResponseEntity.ok(response);
    }
}
