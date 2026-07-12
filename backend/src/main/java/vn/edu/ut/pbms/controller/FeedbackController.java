package vn.edu.ut.pbms.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import vn.edu.ut.pbms.constant.FeedbackStatus;
import vn.edu.ut.pbms.constant.IssueType;
import vn.edu.ut.pbms.dto.request.FeedbackRequest;
import vn.edu.ut.pbms.dto.response.FeedbackResponse;
import vn.edu.ut.pbms.dto.response.PaginatedResponse;
import vn.edu.ut.pbms.service.FeedbackService;

@RestController
@RequestMapping("/api/v1/feedbacks")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('STAFF', 'MANAGER', 'ADMIN')")
@Tag(name = "Feedback & Exception", description = "API quản lý sự cố và phản hồi (mất thẻ, sai biển số, v.v.)")
public class FeedbackController {

    private final FeedbackService feedbackService;

    @Operation(summary = "Lấy danh sách sự cố", description = "Trả về danh sách sự cố có phân trang, hỗ trợ lọc theo loại sự cố và trạng thái")
    @GetMapping
    public ResponseEntity<PaginatedResponse<FeedbackResponse>> getAllFeedbacks(
            @RequestParam(name = "issue_type", required = false) IssueType issueType,
            @RequestParam(name = "status", required = false) FeedbackStatus status,
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {
        
        Page<FeedbackResponse> feedbackPage = feedbackService.getAllFeedbacks(issueType, status, page, size);
        return ResponseEntity.ok(new PaginatedResponse<>(feedbackPage));
    }

    @Operation(summary = "Lấy chi tiết sự cố theo ID")
    @GetMapping("/{id}")
    public ResponseEntity<FeedbackResponse> getFeedbackById(@PathVariable Long id) {
        return ResponseEntity.ok(feedbackService.getFeedbackById(id));
    }

    @Operation(summary = "Tạo mới sự cố", description = "Ghi nhận sự cố mới gắn liền với lượt gửi xe")
    @PostMapping
    public ResponseEntity<FeedbackResponse> createFeedback(@Valid @RequestBody FeedbackRequest request) {
        return ResponseEntity.ok(feedbackService.createFeedback(request));
    }

    @Operation(summary = "Cập nhật sự cố", description = "Cập nhật thông tin hoặc trạng thái xử lý sự cố")
    @PutMapping("/{id}")
    public ResponseEntity<FeedbackResponse> updateFeedback(
            @PathVariable Long id, 
            @Valid @RequestBody FeedbackRequest request) {
        return ResponseEntity.ok(feedbackService.updateFeedback(id, request));
    }
}
