package vn.edu.ut.pbms.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import vn.edu.ut.pbms.constant.FeedbackStatus;
import vn.edu.ut.pbms.constant.IssueType;

@Data
public class FeedbackRequest {
    @NotNull(message = "Parking Session ID is required")
    private Long parkingSessionId;

    @NotNull(message = "Issue Type is required")
    private IssueType issueType;

    @NotBlank(message = "Description cannot be blank")
    private String description;

    @NotNull(message = "Status is required")
    private FeedbackStatus status;
}
