package vn.edu.ut.pbms.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import vn.edu.ut.pbms.constant.UserStatus;
import vn.edu.ut.pbms.dto.request.LoginRequest;
import vn.edu.ut.pbms.dto.response.LoginResponse;
import vn.edu.ut.pbms.entity.User;
import vn.edu.ut.pbms.exception.AuthenticationException;
import vn.edu.ut.pbms.exception.ResourceNotFoundException;
import vn.edu.ut.pbms.repository.UserRepository;
import vn.edu.ut.pbms.service.AuthService;
import vn.edu.ut.pbms.util.JwtUtil;

/**
 * Hiện thực hóa nghiệp vụ xác thực người dùng.
 * Flow: Tìm user → Kiểm tra trạng thái ACTIVE → Verify password → Sinh JWT.
 */
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    public LoginResponse login(LoginRequest request) {
        // 1. Tìm User bằng username
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Tài khoản không tồn tại."));

        // 2. Kiểm tra trạng thái tài khoản
        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new AuthenticationException("Tài khoản đã bị vô hiệu hóa.");
        }

        // 3. Xác thực mật khẩu (BCrypt)
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new AuthenticationException("Mật khẩu không chính xác.");
        }

        // 4. Sinh JWT Token
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());

        // 5. Trả về kết quả đăng nhập
        return LoginResponse.builder()
                .token(token)
                .message("Đăng nhập thành công.")
                .role(user.getRole().name())
                .build();
    }
}
