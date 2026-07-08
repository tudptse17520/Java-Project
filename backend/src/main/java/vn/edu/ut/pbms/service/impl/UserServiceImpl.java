package vn.edu.ut.pbms.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.edu.ut.pbms.constant.Role;
import vn.edu.ut.pbms.constant.UserStatus;
import vn.edu.ut.pbms.dto.request.UpdateStatusRequest;
import vn.edu.ut.pbms.dto.request.UserCreateRequest;
import vn.edu.ut.pbms.dto.request.UserUpdateRequest;
import vn.edu.ut.pbms.dto.response.UserListResponse;
import vn.edu.ut.pbms.dto.response.UserResponse;
import vn.edu.ut.pbms.entity.User;
import vn.edu.ut.pbms.exception.ConflictException;
import vn.edu.ut.pbms.exception.ResourceNotFoundException;
import vn.edu.ut.pbms.repository.UserRepository;
import vn.edu.ut.pbms.service.UserService;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of UserService.
 * Handles all CRUD operations and business rule validations for User Management.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // ==================== GET - Lấy danh sách ====================

    @Override
    @Transactional(readOnly = true)
    public UserListResponse getUsers(String keyword, String role) {
        Role roleEnum = parseRoleOrNull(role);

        List<User> users = userRepository.searchUsers(keyword, roleEnum);

        List<UserResponse> data = users.stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());

        return UserListResponse.builder()
                .totalItems(data.size())
                .data(data)
                .message("Lấy danh sách người dùng thành công.")
                .build();
    }

    // ==================== POST - Tạo mới ====================

    @Override
    public UserResponse createUser(UserCreateRequest request) {
        // Validate unique username
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new ConflictException(
                    "Tên đăng nhập '" + request.getUsername() + "' đã tồn tại trong hệ thống.");
        }

        // Validate unique phone number
        if (userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new ConflictException(
                    "Số điện thoại '" + request.getPhoneNumber() + "' đã được sử dụng.");
        }

        // Parse role from String to Enum
        Role roleEnum = parseRole(request.getRole());

        // Build entity with hashed password and default ACTIVE status
        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phoneNumber(request.getPhoneNumber())
                .role(roleEnum)
                .status(UserStatus.ACTIVE)
                .build();

        User savedUser = userRepository.save(user);
        return mapToUserResponse(savedUser);
    }

    // ==================== PUT - Cập nhật ====================

    @Override
    public UserResponse updateUser(long id, UserUpdateRequest request) {
        // Find existing user or throw 404
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy người dùng với ID: " + id));

        // Check phone number duplication with other accounts
        if (userRepository.existsByPhoneNumberAndIdNot(request.getPhoneNumber(), id)) {
            throw new ConflictException(
                    "Số điện thoại '" + request.getPhoneNumber() + "' đã được sử dụng bởi tài khoản khác.");
        }

        // Parse role from String to Enum
        Role roleEnum = parseRole(request.getRole());

        // Update fields
        user.setFullName(request.getFullName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setRole(roleEnum);

        User updatedUser = userRepository.save(user);
        return mapToUserResponse(updatedUser);
    }

    // ==================== PATCH - Cập nhật trạng thái ====================

    @Override
    public UserResponse updateStatus(long id, UpdateStatusRequest request) {
        // Find existing user or throw 404
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy người dùng với ID: " + id));

        // Safely parse status String to Enum
        UserStatus statusEnum = parseStatus(request.getStatus());

        // Update status
        user.setStatus(statusEnum);

        User updatedUser = userRepository.save(user);
        return mapToUserResponse(updatedUser);
    }

    // ==================== Helper Methods ====================

    /**
     * Map a User entity to a UserResponse DTO.
     * Never exposes the password field.
     */
    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole().name())
                .status(user.getStatus().name())
                .build();
    }

    /**
     * Parse a role String to the Role enum.
     * Throws BusinessRuleViolationException if the value is invalid.
     */
    private Role parseRole(String role) {
        try {
            return Role.valueOf(role.toUpperCase().trim());
        } catch (IllegalArgumentException e) {
            throw new vn.edu.ut.pbms.exception.BusinessRuleViolationException(
                    "Vai trò không hợp lệ: '" + role + "'. Giá trị hợp lệ: ADMIN, MANAGER, STAFF, USER.");
        }
    }

    /**
     * Parse a role String to the Role enum, returning null if blank/null.
     * Used for optional filter parameters.
     */
    private Role parseRoleOrNull(String role) {
        if (role == null || role.isBlank()) {
            return null;
        }
        try {
            return Role.valueOf(role.toUpperCase().trim());
        } catch (IllegalArgumentException e) {
            throw new vn.edu.ut.pbms.exception.BusinessRuleViolationException(
                    "Vai trò không hợp lệ: '" + role + "'. Giá trị hợp lệ: ADMIN, MANAGER, STAFF, USER.");
        }
    }

    /**
     * Parse a status String to the UserStatus enum.
     * Throws BusinessRuleViolationException if the value is invalid.
     */
    private UserStatus parseStatus(String status) {
        try {
            return UserStatus.valueOf(status.toUpperCase().trim());
        } catch (IllegalArgumentException e) {
            throw new vn.edu.ut.pbms.exception.BusinessRuleViolationException(
                    "Trạng thái không hợp lệ: '" + status + "'. Giá trị hợp lệ: ACTIVE, INACTIVE.");
        }
    }
}
