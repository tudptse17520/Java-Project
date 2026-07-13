package vn.edu.ut.pbms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.edu.ut.pbms.entity.Feedback;

/**
 * Repository interface for Feedback entity.
 */
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import vn.edu.ut.pbms.constant.FeedbackStatus;
import vn.edu.ut.pbms.constant.IssueType;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    @Query("SELECT f FROM Feedback f WHERE " +
           "(:issueType IS NULL OR f.issueType = :issueType) AND " +
           "(:status IS NULL OR f.status = :status)")
    Page<Feedback> findAllByFilters(@Param("issueType") IssueType issueType,
                                    @Param("status") FeedbackStatus status,
                                    Pageable pageable);
}
