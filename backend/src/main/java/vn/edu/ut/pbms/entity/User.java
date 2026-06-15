package vn.edu.ut.pbms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.edu.ut.pbms.constant.Role;

import java.util.List;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(name = "full_name", nullable = false, columnDefinition = "nvarchar(100)")
    private String fullName;

    @Column(name = "phone_number", nullable = false, unique = true, length = 20)
    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Role role = Role.USER;

    // ==================== Relationships ====================

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Vehicle> vehicles;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<ParkingSession> parkingSessions;

    // @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    // private List<Booking> bookings; // Tạm ẩn cho đến khi có entity Booking
}
