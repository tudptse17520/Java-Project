package vn.edu.ut.pbms.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FloorRequestDTO {

    @NotBlank(message = "Tên tầng không được để trống")
    private String floorName;

    @NotNull(message = "Cấp độ tầng không được để trống")
    private Integer floorLevel;

    @NotNull(message = "Sức chứa không được để trống")
    @Min(value = 1, message = "Sức chứa phải lớn hơn 0")
    private Integer capacity;

    @NotNull(message = "ID tòa nhà không được để trống")
    private Long buildingId;

    @NotNull(message = "ID loại xe không được để trống")
    private Long vehicleTypeId;
}