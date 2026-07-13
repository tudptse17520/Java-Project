package vn.edu.ut.pbms.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import vn.edu.ut.pbms.constant.UserStatus;
import vn.edu.ut.pbms.dto.request.LoginRequest;
import vn.edu.ut.pbms.dto.response.LoginResponse;
import vn.edu.ut.pbms.dto.response.UserResponse;
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
                .role(user.getRole())
                .build();
    }

    @Override
    public UserResponse getMe() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || !(authentication.getPrincipal() instanceof User)) {
            throw new AuthenticationException("Vui lòng đăng nhập để thực hiện chức năng này.");
        }

        User currentUser = (User) authentication.getPrincipal();
        String username = currentUser.getUsername();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Tài khoản không tồn tại."));

        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole())
                .status(user.getStatus())
                .build();
    }

    @Override
    public void changePassword(vn.edu.ut.pbms.dto.request.ChangePasswordRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || !(authentication.getPrincipal() instanceof User)) {
            throw new AuthenticationException("Vui lòng đăng nhập để thực hiện chức năng này.");
        }

        User currentUser = (User) authentication.getPrincipal();
        String username = currentUser.getUsername();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Tài khoản không tồn tại."));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new vn.edu.ut.pbms.exception.BusinessRuleViolationException("Mật khẩu cũ không chính xác.");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new vn.edu.ut.pbms.exception.BusinessRuleViolationException("Xác nhận mật khẩu không khớp.");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}
