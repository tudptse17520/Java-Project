package vn.edu.ut.pbms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for sending building operation result back to the client in API responses.
 * Contains the building ID and a status message.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BuildingResponseDTO {

    private Long id;

    private String message;
}
