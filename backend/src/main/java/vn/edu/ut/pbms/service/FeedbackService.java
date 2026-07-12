package vn.edu.ut.pbms.service;

import org.springframework.data.domain.Page;
import vn.edu.ut.pbms.constant.FeedbackStatus;
import vn.edu.ut.pbms.constant.IssueType;
import vn.edu.ut.pbms.dto.request.FeedbackRequest;
import vn.edu.ut.pbms.dto.response.FeedbackResponse;

public interface FeedbackService {
    Page<FeedbackResponse> getAllFeedbacks(IssueType issueType, FeedbackStatus status, int page, int size);
    FeedbackResponse getFeedbackById(Long id);
    FeedbackResponse createFeedback(FeedbackRequest request);
    FeedbackResponse updateFeedback(Long id, FeedbackRequest request);
}
