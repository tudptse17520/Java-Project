package vn.edu.ut.pbms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.edu.ut.pbms.entity.User;

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
}
