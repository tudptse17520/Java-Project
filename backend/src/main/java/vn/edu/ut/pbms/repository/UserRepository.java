package vn.edu.ut.pbms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.edu.ut.pbms.constant.Role;
import vn.edu.ut.pbms.entity.User;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for User entity.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Find a user by their username.
     * Useful for authentication logic.
     *
     * @param username the username to search for
     * @return an Optional containing the User if found, or empty
     */
    Optional<User> findByUsername(String username);

    /**
     * Check if a user exists with the given username.
     *
     * @param username the username to check
     * @return true if the user exists
     */
    boolean existsByUsername(String username);

    /**
     * Check if a user exists with the given phone number.
     *
     * @param phoneNumber the phone number to check
     * @return true if the phone number is already registered
     */
    boolean existsByPhoneNumber(String phoneNumber);

    /**
     * Check if another user (excluding the given ID) already uses the specified phone number.
     *
     * @param phoneNumber the phone number to check
     * @param id          the ID of the current user to exclude
     * @return true if the phone number is used by another account
     */
    boolean existsByPhoneNumberAndIdNot(String phoneNumber, Long id);

    /**
     * Search users dynamically by a partial keyword (matching fullName or phoneNumber)
     * and an optional role filter.
     * Both parameters are optional — passing null skips that filter.
     *
     * @param keyword partial text to match against fullName or phoneNumber (case-insensitive)
     * @param role    optional role filter
     * @return list of users matching the criteria
     */
    @Query("SELECT u FROM User u WHERE " +
            "(:keyword IS NULL OR :keyword = '' OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR u.phoneNumber LIKE CONCAT('%', :keyword, '%')) " +
            "AND (:role IS NULL OR u.role = :role)")
    List<User> searchUsers(@Param("keyword") String keyword, @Param("role") Role role);
}
