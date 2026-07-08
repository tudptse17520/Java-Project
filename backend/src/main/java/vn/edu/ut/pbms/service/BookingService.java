package vn.edu.ut.pbms.service;

import java.util.List;
import vn.edu.ut.pbms.dto.request.BookingRequestDTO;
import vn.edu.ut.pbms.dto.response.BookingListResponseDTO;
import vn.edu.ut.pbms.dto.response.BookingResponseDTO;

public interface BookingService {
    BookingResponseDTO createBooking(BookingRequestDTO request);
    List<BookingListResponseDTO> getBookingsByUserId(Long userId);
    List<BookingListResponseDTO> getAllBookings();
}
