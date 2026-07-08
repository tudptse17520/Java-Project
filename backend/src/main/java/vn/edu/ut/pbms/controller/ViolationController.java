package vn.edu.ut.pbms.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.ut.pbms.dto.request.ExceptionRequestDTOs.ViolationRequest;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/violations")
public class ViolationController {

    // 6. Ghi nhận xe đỗ sai vị trí
    @PostMapping
    public ResponseEntity<?> createViolation(@RequestBody ViolationRequest request) {
        // TODO: Map DTO qua Entity, lưu vào bảng violation_log dưới DB
        Long newViolationId = 99L; // Giả lập ID sinh tự động
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of(
                        "id", newViolationId,
                        "message", "Đã ghi nhận biên bản xe đỗ sai vị trí. Sẽ truy thu khi ra cổng."));
    }
}