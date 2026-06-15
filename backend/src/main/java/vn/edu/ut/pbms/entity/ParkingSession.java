package vn.edu.ut.pbms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.edu.ut.pbms.constant.ParkingSessionStatus;

/**
 * Stub entity for ParkingSession.
 * Contains only the minimal fields needed for VehicleType deactivation check (E3).
 * TODO: Expand with full fields (check-in time, check-out time, fee, etc.) when implementing Parking Session feature.
 */
@Entity
@Table(name = "parking_session")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParkingSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ParkingSessionStatus status;
}
