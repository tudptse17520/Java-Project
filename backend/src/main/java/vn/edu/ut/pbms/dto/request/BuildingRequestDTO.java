package vn.edu.ut.pbms.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.edu.ut.pbms.constant.BuildingStatus;

/**
 * DTO for receiving building data from client requests (Create / Update).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BuildingRequestDTO {
    @NotBlank(message = "Tên tòa nhà không được để trống.")
    @Size(max = 100, message = "Tên tòa nhà không được vượt quá 100 ký tự.")
    private String buildingName;
    @NotBlank(message = "Địa chỉ không được để trống.")
    @Size(max = 255, message = "Địa chỉ không được vượt quá 255 ký tự.")
    private String address;
    @NotNull(message = "Số tầng không được để trống.")
    @Min(value = 1, message = "Số tầng phải lớn hơn hoặc bằng 1.")
    private Integer numberOfFloors;
    private BuildingStatus status;
}
