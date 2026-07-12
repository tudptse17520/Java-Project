package vn.edu.ut.pbms.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequestDTO {


    @NotNull(message = "Mã phương tiện không được để trống")
    private Long vehicleId;

    @NotNull(message = "Mã vị trí đỗ không được để trống")
    private Long parkingSlotId;

    @NotBlank(message = "Thời gian dự kiến vào không được để trống")
    private String expectedTimeIn;

    @NotBlank(message = "Thời gian dự kiến ra không được để trống")
    private String expectedTimeOut;
}
