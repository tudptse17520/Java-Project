package vn.edu.ut.pbms.dto.response;

import lombok.Builder;
import lombok.Data;
import vn.edu.ut.pbms.constant.FeedbackStatus;
import vn.edu.ut.pbms.constant.IssueType;

@Data
@Builder
public class FeedbackResponse {
    private Long id;
    private Long parkingSessionId;
    private IssueType issueType;
    private String description;
    private FeedbackStatus status;
}
