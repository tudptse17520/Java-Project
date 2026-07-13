package vn.edu.ut.pbms.dto.response;

import vn.edu.ut.pbms.constant.BookingStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponseDTO {
    private Long id;
    private BookingStatus status;
    private String message;
}
