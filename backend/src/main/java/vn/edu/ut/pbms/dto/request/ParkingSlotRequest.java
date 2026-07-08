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
public class ParkingSlotRequest {

    @NotNull(message = "Mã tầng không được để trống")
    private Long floorId;

    @NotBlank(message = "Tên vị trí đỗ không được để trống")
    private String slotName;

    private String status;
}
