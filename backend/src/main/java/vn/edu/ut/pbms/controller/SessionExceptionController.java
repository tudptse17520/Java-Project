// package vn.edu.ut.pbms.controller;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;
// import vn.edu.ut.pbms.dto.request.ExceptionRequestDTOs.*;
// import vn.edu.ut.pbms.dto.response.InvoiceDTO;
// import vn.edu.ut.pbms.service.SessionService;

// import java.util.Map;

// @RestController
// @RequestMapping("/api/v1/sessions")
// public class SessionExceptionController {

// @Autowired
// private SessionService sessionService;

// // 1. Xử lý mất vé
// @PostMapping("/{id}/lost-ticket")
// public ResponseEntity<InvoiceDTO> resolveLostTicket(@PathVariable("id") Long
// id, @RequestBody LostTicketRequest request) {
// InvoiceDTO invoice = sessionService.resolveLostTicket(id, request);
// return ResponseEntity.ok(invoice);
// }

// // 2. Checkout (Phát hiện sai biển số sẽ văng lỗi 409 từ Service)
// @PostMapping("/{id}/checkout")
// public ResponseEntity<?> checkout(@PathVariable("id") Long id, @RequestBody
// CheckoutRequest request) {
// sessionService.processCheckoutValidation(id, request);
// return ResponseEntity.ok(Map.of("message", "Biển số hợp lệ. Đang xử lý tính
// tiền..."));
// }

// // 3. Override (Staff ép mở cổng khi sai biển)
// @PostMapping("/{id}/override-checkout")
// public ResponseEntity<?> overrideCheckout(@PathVariable("id") Long id,
// @RequestBody OverrideCheckoutRequest request) {
// String result = sessionService.overrideCheckout(id, request);
// return ResponseEntity.ok(Map.of("session_id", id, "status", "COMPLETED",
// "message", result));
// }

// // 4. Tính tiền (Bao gồm xử lý lố giờ)
// @GetMapping("/{id}/calculate-fee")
// public ResponseEntity<InvoiceDTO> calculateFee(@PathVariable("id") Long id) {
// InvoiceDTO invoice = sessionService.calculateFee(id);
// return ResponseEntity.ok(invoice);
// }

// // 5. Kiểm tra trước khi mở cổng (Phát hiện nợ văng lỗi 402)
// @PostMapping("/{id}/exit-gate")
// public ResponseEntity<?> checkExitGate(@PathVariable("id") Long id) {
// sessionService.validateExitGate(id);
// return ResponseEntity.ok(Map.of("message", "Thanh toán hợp lệ, mở cổng thành
// công."));
// }
// }