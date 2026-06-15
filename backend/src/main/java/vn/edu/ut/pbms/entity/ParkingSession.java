package vn.edu.ut.pbms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.edu.ut.pbms.constant.ParkingSessionStatus;

@Entity
@Table(name = "parking_session")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParkingSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ==================== Relationships ====================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parking_slot_id")
    private ParkingSlot parkingSlot;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ParkingSessionStatus status = ParkingSessionStatus.IN;
}
