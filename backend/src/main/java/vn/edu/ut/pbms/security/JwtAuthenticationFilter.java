package vn.edu.ut.pbms.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import vn.edu.ut.pbms.entity.User;
import vn.edu.ut.pbms.repository.UserRepository;
import vn.edu.ut.pbms.util.JwtUtil;

import java.io.IOException;
import java.util.Collections;

/**
 * Filter chặn các request để xác thực JWT token.
 * Trích xuất token từ header Authorization, xác thực, lấy username,
 * và đưa User vào SecurityContextHolder.
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String username;

        // Bỏ qua nếu không có header Authorization hợp lệ
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);
        
        try {
            if (jwtUtil.validateToken(jwt)) {
                username = jwtUtil.extractUsername(jwt);
                
                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    User user = userRepository.findByUsername(username).orElse(null);
                    
                    if (user != null && user.getStatus() == vn.edu.ut.pbms.constant.UserStatus.ACTIVE) {
                        // Tạo đối tượng Authentication với principal là đối tượng User
                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                user,
                                null,
                                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
                        );
                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    }
                }
            }
        } catch (Exception e) {
            // Có lỗi xác thực token (hết hạn, sai chữ ký, ...)
            // Bỏ qua để filter khác xử lý (sẽ bị block vì không có authentication)
        }

        filterChain.doFilter(request, response);
    }
}
