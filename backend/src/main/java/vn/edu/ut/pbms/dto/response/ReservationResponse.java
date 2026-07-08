package vn.edu.ut.pbms.dto.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class ReservationResponse {
    private Long id;            // Mã định danh đặt chỗ
    private String userName;    // Tên người đặt chỗ
    private String slotName;    // Tên vị trí đỗ xe
    private LocalDateTime startTime; // Thời gian bắt đầu
    private LocalDateTime endTime;   // Thời gian kết thúc
    private String status;      // Trạng thái hiện tại
}
