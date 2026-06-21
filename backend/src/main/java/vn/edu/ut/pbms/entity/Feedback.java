package vn.edu.ut.pbms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.edu.ut.pbms.constant.FeedbackStatus;
import vn.edu.ut.pbms.constant.IssueType;

/**
 * Entity đại diện cho bảng feedback trong SQL Server.
 * Ghi nhận sự cố (mất thẻ, sai biển số,...) gắn liền với lượt gửi xe cụ thể.
 */
@Entity
@Table(name = "feedback")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "issue_type", nullable = false)
    private IssueType issueType;

    @Column(columnDefinition = "nvarchar(500)")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private FeedbackStatus status = FeedbackStatus.REPORTED;

    // ==================== Relationships ====================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parking_session_id", nullable = false)
    private ParkingSession parkingSession;
}
