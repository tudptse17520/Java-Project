package vn.edu.ut.pbms.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.edu.ut.pbms.dto.request.CheckOutRequest;
import vn.edu.ut.pbms.dto.request.LostTicketRequest;
import vn.edu.ut.pbms.dto.request.OverrideCheckoutRequest;
import vn.edu.ut.pbms.dto.request.PaymentRequest;
import vn.edu.ut.pbms.dto.request.PlateValidationRequest;
import vn.edu.ut.pbms.dto.response.CheckOutResponse;
import vn.edu.ut.pbms.dto.response.FeeCalculationResponse;
import vn.edu.ut.pbms.dto.response.PaymentResponse;
import vn.edu.ut.pbms.exception.ErrorResponse;
import vn.edu.ut.pbms.service.CheckoutService;

/**
 * REST Controller xử lý quy trình xe ra bãi (Check-out) và thanh toán chi phí.
 */
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name = "Checkout", description = "API quản lý và xử lý quy trình xe ra bãi (Check-out)")
public class CheckoutController {

    private final CheckoutService checkoutService;

    @Operation(
            summary = "Xác thực biển số xe ra bãi",
            description = "Đối chiếu biển số lúc ra và lúc vào. Nếu không khớp sẽ trả về lỗi 409 và ghi nhận sự cố."
    )
    @ApiResponses(value = {
        @ApiResponse(
                responseCode = "200",
                description = "Xác thực biển số khớp thành công"
        ),
        @ApiResponse(
                responseCode = "400",
                description = "Dữ liệu đầu vào không hợp lệ",
                content = @Content(schema = @Schema(implementation = ErrorResponse.class))
        ),
        @ApiResponse(
                responseCode = "409",
                description = "Biển số xe ra không khớp với biển số lúc vào",
                content = @Content(schema = @Schema(implementation = ErrorResponse.class))
        )
    })
    @PostMapping("/sessions/{session_id}/validate-plate")
    public ResponseEntity<Map<String, String>> validatePlate(
            @PathVariable("session_id") Long sessionId,
            @Valid @RequestBody PlateValidationRequest request) {

        checkoutService.validatePlate(sessionId, request);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Xác thực biển số trùng khớp.");
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Bỏ qua lỗi sai biển số (Dành cho nhân viên)",
            description = "Nhân viên phê duyệt cho phép xe ra bãi bất chấp biển số không khớp, đồng thời đóng phiên và giải phóng slot."
    )
    @ApiResponses(value = {
        @ApiResponse(
                responseCode = "200",
                description = "Ghi đè và cho xe ra bãi thành công",
                content = @Content(schema = @Schema(implementation = CheckOutResponse.class))
        ),
        @ApiResponse(
                responseCode = "400",
                description = "Nhân viên không có quyền hoặc vi phạm quy tắc",
                content = @Content(schema = @Schema(implementation = ErrorResponse.class))
        ),
        @ApiResponse(
                responseCode = "444",
                description = "Không tìm thấy phiên gửi xe hoặc nhân viên",
                content = @Content(schema = @Schema(implementation = ErrorResponse.class))
        )
    })
    @PostMapping("/sessions/{session_id}/override-checkout")
    public ResponseEntity<CheckOutResponse> overrideCheckout(
            @PathVariable("session_id") Long sessionId,
            @Valid @RequestBody OverrideCheckoutRequest request) {

        CheckOutResponse response = checkoutService.overrideCheckout(sessionId, request);
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Xử lý báo mất thẻ/vé xe gửi",
            description = "Tính phí gửi xe thực tế cộng thêm phí phạt mất vé cố định, ghi nhận sự cố."
    )
    @ApiResponses(value = {
        @ApiResponse(
                responseCode = "200",
                description = "Tính phí mất vé thành công",
                content = @Content(schema = @Schema(implementation = FeeCalculationResponse.class))
        ),
        @ApiResponse(
                responseCode = "400",
                description = "Nhân viên phê duyệt không hợp lệ",
                content = @Content(schema = @Schema(implementation = ErrorResponse.class))
        )
    })
    @PostMapping("/sessions/{session_id}/lost-ticket")
    public ResponseEntity<FeeCalculationResponse> lostTicket(
            @PathVariable("session_id") Long sessionId,
            @Valid @RequestBody LostTicketRequest request) {

        FeeCalculationResponse response = checkoutService.processLostTicket(sessionId, request);
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Tính cước phí gửi xe thực tế",
            description = "Tính phí gửi xe dựa trên thời gian đỗ thực tế và chính sách giá đang áp dụng (áp dụng phụ thu nếu quá giờ)."
    )
    @ApiResponses(value = {
        @ApiResponse(
                responseCode = "200",
                description = "Tính phí đỗ xe thành công",
                content = @Content(schema = @Schema(implementation = FeeCalculationResponse.class))
        )
    })
    @PostMapping("/sessions/{session_id}/calculate-fee")
    public ResponseEntity<FeeCalculationResponse> calculateFee(
            @PathVariable("session_id") Long sessionId) {

        FeeCalculationResponse response = checkoutService.calculateFee(sessionId);
        return ResponseEntity.ok(response);
    }



    @Operation(
            summary = "Kiểm tra cổng ra bãi xe (exit-gate)",
            description = "Kiểm tra xem xe đã thanh toán đầy đủ phí đỗ xe chưa trước khi mở barrier."
    )
    @ApiResponses(value = {
        @ApiResponse(
                responseCode = "200",
                description = "Đã hoàn tất thanh toán, sẵn sàng qua barrier"
        ),
        @ApiResponse(
                responseCode = "402",
                description = "Xe chưa thanh toán đủ phí (Payment Required)",
                content = @Content(schema = @Schema(implementation = ErrorResponse.class))
        )
    })
    @PostMapping("/sessions/{session_id}/exit-gate")
    public ResponseEntity<Map<String, String>> exitGate(
            @PathVariable("session_id") Long sessionId) {

        checkoutService.checkExitGate(sessionId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Đã thanh toán đầy đủ. Mở barrier.");
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Hoàn tất Check-out xe ra bãi",
            description = "Đóng phiên gửi xe (chuyển sang COMPLETED) và giải phóng slot đỗ xe sang AVAILABLE."
    )
    @ApiResponses(value = {
        @ApiResponse(
                responseCode = "200",
                description = "Check-out hoàn tất thành công",
                content = @Content(schema = @Schema(implementation = CheckOutResponse.class))
        ),
        @ApiResponse(
                responseCode = "402",
                description = "Chưa thanh toán đủ phí",
                content = @Content(schema = @Schema(implementation = ErrorResponse.class))
        )
    })
    @PutMapping("/sessions/{session_id}/check-out")
    public ResponseEntity<CheckOutResponse> checkOut(
            @PathVariable("session_id") Long sessionId,
            @Valid @RequestBody CheckOutRequest request) {

        CheckOutResponse response = checkoutService.checkOut(sessionId, request);
        return ResponseEntity.ok(response);
    }
}
