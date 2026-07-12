package vn.edu.ut.pbms.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import vn.edu.ut.pbms.constant.FeedbackStatus;
import vn.edu.ut.pbms.constant.IssueType;
import vn.edu.ut.pbms.dto.request.FeedbackRequest;
import vn.edu.ut.pbms.dto.response.FeedbackResponse;
import vn.edu.ut.pbms.entity.Feedback;
import vn.edu.ut.pbms.entity.ParkingSession;
import vn.edu.ut.pbms.exception.ResourceNotFoundException;
import vn.edu.ut.pbms.repository.FeedbackRepository;
import vn.edu.ut.pbms.repository.ParkingSessionRepository;
import vn.edu.ut.pbms.service.FeedbackService;

@Service
@RequiredArgsConstructor
public class FeedbackServiceImpl implements FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final ParkingSessionRepository parkingSessionRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<FeedbackResponse> getAllFeedbacks(IssueType issueType, FeedbackStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Feedback> feedbacks = feedbackRepository.findAllByFilters(issueType, status, pageable);
        return feedbacks.map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public FeedbackResponse getFeedbackById(Long id) {
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback not found with ID: " + id));
        return mapToResponse(feedback);
    }

    @Override
    @Transactional
    public FeedbackResponse createFeedback(FeedbackRequest request) {
        ParkingSession session = parkingSessionRepository.findById(request.getParkingSessionId())
                .orElseThrow(() -> new ResourceNotFoundException("Parking Session not found with ID: " + request.getParkingSessionId()));

        Feedback feedback = Feedback.builder()
                .parkingSession(session)
                .issueType(request.getIssueType())
                .description(request.getDescription())
                .status(request.getStatus() != null ? request.getStatus() : FeedbackStatus.REPORTED)
                .build();

        Feedback savedFeedback = feedbackRepository.save(feedback);
        return mapToResponse(savedFeedback);
    }

    @Override
    @Transactional
    public FeedbackResponse updateFeedback(Long id, FeedbackRequest request) {
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback not found with ID: " + id));

        ParkingSession session = parkingSessionRepository.findById(request.getParkingSessionId())
                .orElseThrow(() -> new ResourceNotFoundException("Parking Session not found with ID: " + request.getParkingSessionId()));

        feedback.setParkingSession(session);
        feedback.setIssueType(request.getIssueType());
        feedback.setDescription(request.getDescription());
        
        if (request.getStatus() != null) {
            feedback.setStatus(request.getStatus());
        }

        Feedback updatedFeedback = feedbackRepository.save(feedback);
        return mapToResponse(updatedFeedback);
    }

    private FeedbackResponse mapToResponse(Feedback feedback) {
        return FeedbackResponse.builder()
                .id(feedback.getId())
                .parkingSessionId(feedback.getParkingSession() != null ? feedback.getParkingSession().getId() : null)
                .issueType(feedback.getIssueType())
                .description(feedback.getDescription())
                .status(feedback.getStatus())
                .build();
    }
}
