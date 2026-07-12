package vn.edu.ut.pbms.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.edu.ut.pbms.constant.BuildingStatus;

/**
 * DTO for updating building status only (PATCH).
 * Contains a single status field mapped to BuildingStatus enum.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BuildingStatusRequestDTO {
    @NotNull(message = "Trạng thái không được để trống.")
    private BuildingStatus status;
}
