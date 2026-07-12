package vn.edu.ut.pbms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Response DTO wrapping a list of users with total count and message.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserListResponse {
    private long totalItems;

    private List<UserResponse> data;

    private String message;
}
