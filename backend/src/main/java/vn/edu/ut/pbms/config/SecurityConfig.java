package vn.edu.ut.pbms.config;

import lombok.RequiredArgsConstructor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import vn.edu.ut.pbms.security.JwtAuthenticationFilter;

import java.util.List;

/**
 * Cấu hình Spring Security cho hệ thống PBMS.
 * - Tắt CSRF (REST API stateless).
 * - Session STATELESS (dùng JWT thay vì session).
 * - Cho phép truy cập public: /api/v1/auth/**, Swagger UI.
 * - Các endpoint còn lại tạm thời permitAll (sẽ thêm JWT Filter sau).
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
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
                        // Yêu cầu xác thực cho các thao tác check-out, override, calculate-fee...
                        .requestMatchers("/api/v1/sessions/**").authenticated()
                        // Quản lý người dùng
                        .requestMatchers("/api/v1/users/**").authenticated()
                        // Cho phép public stream
                        .requestMatchers("/api/v1/buildings/availability-stream").permitAll()
                        .requestMatchers("/api/v1/buildings/*/availability-stream").permitAll()
                        // Quản lý tòa nhà
                        .requestMatchers("/api/v1/buildings/**").authenticated()
                        // Quản lý tầng
                        .requestMatchers("/api/v1/floors/**").authenticated()
                        // Quản lý ô đỗ
                        .requestMatchers("/api/v1/slots/**").authenticated()
                        // Quản lý loại phương tiện
                        .requestMatchers("/api/v1/vehicle-types/**").authenticated()
                        // Yêu cầu quyền ADMIN hoặc MANAGER cho các API Báo cáo & Thống kê
                        .requestMatchers("/api/v1/reports/**").hasAnyRole("ADMIN", "MANAGER")
                        // Đặt chỗ
                        .requestMatchers("/api/v1/bookings/**").authenticated()
                        // Tạm thời cho phép tất cả các endpoint khác, đổi thành bắt buộc authenticated
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * CORS configuration to allow Frontend (Next.js at port 3000) to call Backend API.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
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
