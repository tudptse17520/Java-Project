package vn.edu.ut.pbms.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.edu.ut.pbms.constant.VehicleTypeStatus;

/**
 * DTO for receiving vehicle type data from client requests (Create / Update).
 * Validation annotations handle E1 (empty name) automatically.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehicleTypeRequestDTO {

    @NotBlank(message = "Tên loại phương tiện không được để trống.")
    @Size(max = 100, message = "Tên loại phương tiện không được vượt quá 100 ký tự.")
    private String typeName;

    @JsonProperty("description")
    @Size(max = 255, message = "Mô tả không được vượt quá 255 ký tự.")
    private String description;

    @JsonProperty("status")
    private VehicleTypeStatus status;
}
