package vn.edu.ut.pbms.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.edu.ut.pbms.dto.request.LoginRequest;
import vn.edu.ut.pbms.dto.response.LoginResponse;
import vn.edu.ut.pbms.dto.response.UserResponse;
import vn.edu.ut.pbms.exception.ErrorResponse;
import vn.edu.ut.pbms.service.AuthService;

/**
 * Controller xử lý các API liên quan đến xác thực người dùng.
 * Base URL: /api/v1/auth
 */
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "API xác thực và quản lý phiên đăng nhập")
public class AuthController {

    private final AuthService authService;

    /**
     * API đăng nhập hệ thống.
     * Xác thực tài khoản người dùng và cấp JWT token.
     *
     * @param request chứa username và password
     * @return LoginResponse chứa token, message, role
     */
    @Operation(
            summary = "Đăng nhập hệ thống",
            description = "Xác thực tài khoản người dùng bằng username/password và cấp mã truy cập JWT."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Đăng nhập thành công",
                    content = @Content(schema = @Schema(implementation = LoginResponse.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Dữ liệu đầu vào không hợp lệ (thiếu username hoặc password)",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Xác thực thất bại (sai mật khẩu hoặc tài khoản bị vô hiệu hóa)",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Tài khoản không tồn tại trong hệ thống",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy thông tin người dùng đang đăng nhập.
     *
     * @return UserResponse chứa chi tiết người dùng
     */
    @Operation(
            summary = "Lấy thông tin người dùng hiện tại",
            description = "Trả về thông tin chi tiết của người dùng đang đăng nhập dựa trên JWT token."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Thành công",
                    content = @Content(schema = @Schema(implementation = UserResponse.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Chưa đăng nhập hoặc token không hợp lệ",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMe() {
        UserResponse response = authService.getMe();
        return ResponseEntity.ok(response);
    }
}
