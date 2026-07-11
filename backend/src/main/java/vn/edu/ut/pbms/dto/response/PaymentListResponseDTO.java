package vn.edu.ut.pbms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Wrapper DTO for paginated/filtered payment list responses.
 * Contains total_items count, a message, and the data list.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentListResponseDTO {
    private int totalItems;
    private String message;
    private List<PaymentResponseDTO> data;
}
