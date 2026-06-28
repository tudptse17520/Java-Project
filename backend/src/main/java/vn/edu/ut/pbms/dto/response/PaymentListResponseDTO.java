package vn.edu.ut.pbms.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
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

    @JsonProperty("total_items")
    private int totalItems;

    @JsonProperty("message")
    private String message;

    @JsonProperty("data")
    private List<PaymentResponseDTO> data;
}
