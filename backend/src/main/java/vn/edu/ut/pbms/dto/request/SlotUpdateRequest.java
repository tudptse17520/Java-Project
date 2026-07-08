package vn.edu.ut.pbms.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SlotUpdateRequest {
    @NotBlank(message = "Trạng thái không được để trống")
    private String status; 
}