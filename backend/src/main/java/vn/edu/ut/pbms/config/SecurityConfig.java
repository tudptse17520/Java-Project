package vn.edu.ut.pbms.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Cấu hình Spring Security cho hệ thống PBMS.
 * - Tắt CSRF (REST API stateless).
 * - Session STATELESS (dùng JWT thay vì session).
 * - Cho phép truy cập public: /api/v1/auth/**, Swagger UI.
 * - Các endpoint còn lại tạm thời permitAll (sẽ thêm JWT Filter sau).
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Endpoint xác thực - public
                        .requestMatchers("/api/v1/auth/**").permitAll()
                        // Swagger UI & OpenAPI docs - public
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**"
                        ).permitAll()
                        // Tạm thời cho phép tất cả (sẽ siết lại khi triển khai JWT Filter)
                        .anyRequest().permitAll());

        return http.build();
    }

    /**
     * Bean mã hóa mật khẩu sử dụng thuật toán BCrypt.
     * Dùng để hash password khi tạo user và verify khi đăng nhập.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
