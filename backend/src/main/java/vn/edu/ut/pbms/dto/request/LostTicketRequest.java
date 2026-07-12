package vn.edu.ut.pbms.dto.request;


import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO yêu cầu báo mất vé/thẻ xe.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LostTicketRequest {

    private String note;
}
