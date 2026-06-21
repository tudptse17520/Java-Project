package vn.edu.ut.pbms.exception;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Standard JSON error response structure returned by the API.
 *
 * Example:
 * {
 *   "status": 400,
 *   "error": "Bad Request",
 *   "message": "Tên loại phương tiện không được để trống."
 * }
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {

    private int status;
    private String error;
    private String message;
}
