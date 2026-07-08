package vn.edu.ut.pbms.service;

import vn.edu.ut.pbms.dto.request.UpdateStatusRequest;
import vn.edu.ut.pbms.dto.request.UserCreateRequest;
import vn.edu.ut.pbms.dto.request.UserUpdateRequest;
import vn.edu.ut.pbms.dto.response.UserListResponse;
import vn.edu.ut.pbms.dto.response.UserResponse;

/**
 * Service interface for User Management business logic.
 * Defines all operations for managing users in the system.
 */
public interface UserService {

    /**
     * Retrieve users with optional keyword search and role filter.
     *
     * @param keyword partial text to match against fullName or phoneNumber
     * @param role    optional role filter (String representation of Role enum)
     * @return UserListResponse containing matched users, total count, and message
     */
    UserListResponse getUsers(String keyword, String role);

    /**
     * Create a new user in the system.
     * Validates unique constraints on username and phoneNumber.
     * Hashes the raw password using BCrypt.
     * Sets default status to ACTIVE.
     *
     * @param request the user creation payload
     * @return the created user as a response DTO
     */
    UserResponse createUser(UserCreateRequest request);

    /**
     * Update an existing user's profile information.
     * Prevents phone number duplication with other accounts.
     *
     * @param id      the ID of the user to update
     * @param request the user update payload
     * @return the updated user as a response DTO
     */
    UserResponse updateUser(long id, UserUpdateRequest request);

    /**
     * Update a user's status (ACTIVE/INACTIVE).
     * Safely parses the status string to the UserStatus enum.
     *
     * @param id      the ID of the user to update
     * @param request the status update payload
     * @return the updated user as a response DTO
     */
    UserResponse updateStatus(long id, UpdateStatusRequest request);
}
