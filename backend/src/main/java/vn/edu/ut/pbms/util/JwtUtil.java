package vn.edu.ut.pbms.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * Lớp tiện ích xử lý JWT Token.
 * Cung cấp các hàm: sinh token, xác thực token, trích xuất thông tin từ token.
 */
@Component
public class JwtUtil {

    private final SecretKey secretKey;
    private final long expiration;

    public JwtUtil(@Value("${jwt.secret}") String secret,
                   @Value("${jwt.expiration}") long expiration) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expiration = expiration;
    }

    /**
     * Sinh JWT token chứa username và role.
     *
     * @param username tên tài khoản người dùng
     * @param role     vai trò của người dùng (ADMIN, MANAGER, STAFF, USER)
     * @return chuỗi JWT token đã ký
     */
    public String generateToken(String username, String role) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);

        return Jwts.builder()
                .subject(username)
                .claim("role", role)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(secretKey)
                .compact();
    }

    /**
     * Trích xuất username (subject) từ JWT token.
     *
     * @param token chuỗi JWT token
     * @return username được lưu trong token
     */
    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    /**
     * Trích xuất role từ JWT token.
     *
     * @param token chuỗi JWT token
     * @return role được lưu trong token
     */
    public String extractRole(String token) {
        return extractAllClaims(token).get("role", String.class);
    }

    /**
     * Xác thực tính hợp lệ của JWT token.
     * Kiểm tra chữ ký và thời hạn hiệu lực.
     *
     * @param token chuỗi JWT token cần xác thực
     * @return true nếu token hợp lệ và chưa hết hạn
     */
    public boolean validateToken(String token) {
        try {
            extractAllClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    /**
     * Giải mã và trích xuất toàn bộ Claims từ JWT token.
     *
     * @param token chuỗi JWT token
     * @return đối tượng Claims chứa toàn bộ thông tin trong payload
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
