package vn.edu.ut.pbms.controller;

import java.util.List;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import vn.edu.ut.pbms.dto.request.BookingRequestDTO;
import vn.edu.ut.pbms.dto.response.BookingListResponseDTO;
import vn.edu.ut.pbms.dto.response.BookingResponseDTO;
import vn.edu.ut.pbms.service.BookingService;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name = "Booking", description = "API quản lý đặt chỗ đỗ xe trước từ xa")
public class BookingController {

    private final BookingService bookingService;

    @Operation(summary = "Đặt chỗ đỗ trước từ xa")
    @PostMapping("/bookings")
    public ResponseEntity<BookingResponseDTO> createBooking(
            @Valid @RequestBody BookingRequestDTO request) {
        BookingResponseDTO response = bookingService.createBooking(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "Kiểm tra lịch sử đặt chỗ cá nhân của người dùng")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER') or #userId == authentication.principal.id")
    @GetMapping("/users/{userId}/bookings")
    public ResponseEntity<List<BookingListResponseDTO>> getUserBookings(
            @PathVariable("userId") Long userId) {
        List<BookingListResponseDTO> response = bookingService.getBookingsByUserId(userId);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Xem danh sách toàn bộ lượt đặt chỗ (Dành cho Manager)")
    @GetMapping("/bookings")
    public ResponseEntity<List<BookingListResponseDTO>> getAllBookings() {
        List<BookingListResponseDTO> response = bookingService.getAllBookings();
        return ResponseEntity.ok(response);
    }
}
