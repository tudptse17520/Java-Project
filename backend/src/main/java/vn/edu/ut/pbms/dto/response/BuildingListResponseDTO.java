package vn.edu.ut.pbms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO for sending building list data back to the client in API responses.
 * Contains a message and a list of building details.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BuildingListResponseDTO {

    private String message;

    private List<BuildingDetailResponseDTO> data;
}
