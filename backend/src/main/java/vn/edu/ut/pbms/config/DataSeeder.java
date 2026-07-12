package vn.edu.ut.pbms.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import vn.edu.ut.pbms.constant.Role;
import vn.edu.ut.pbms.constant.UserStatus;
import vn.edu.ut.pbms.entity.User;
import vn.edu.ut.pbms.repository.UserRepository;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        seedUsers();
    }

    private void seedUsers() {
        log.info("Đang kiểm tra và khởi tạo dữ liệu tài khoản mẫu...");
        String rawPassword = "password";
        String encodedPassword = passwordEncoder.encode(rawPassword);

        upsertUser("admin", encodedPassword, "Quản trị viên", "0900000001", Role.ADMIN);
        upsertUser("manager", encodedPassword, "Quản lý bãi xe", "0900000002", Role.MANAGER);
        upsertUser("staff", encodedPassword, "Nhân viên", "0900000003", Role.STAFF);
        upsertUser("user", encodedPassword, "Khách hàng", "0900000004", Role.USER);

        log.info("Đã đảm bảo 4 tài khoản mẫu (admin, manager, staff, user) tồn tại với mật khẩu mặc định là: {}", rawPassword);
    }

    private void upsertUser(String username, String encodedPassword, String fullName, String phone, Role role) {
        userRepository.findByUsername(username).ifPresentOrElse(
                user -> {
                    user.setPassword(encodedPassword);
                    user.setFullName(fullName);
                    user.setPhoneNumber(phone);
                    user.setRole(role);
                    user.setStatus(UserStatus.ACTIVE);
                    userRepository.save(user);
                },
                () -> {
                    User newUser = User.builder()
                            .username(username)
                            .password(encodedPassword)
                            .fullName(fullName)
                            .phoneNumber(phone)
                            .role(role)
                            .status(UserStatus.ACTIVE)
                            .build();
                    userRepository.save(newUser);
                }
        );
    }
}
