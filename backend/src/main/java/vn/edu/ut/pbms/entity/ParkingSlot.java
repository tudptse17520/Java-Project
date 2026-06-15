package vn.edu.ut.pbms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.edu.ut.pbms.constant.ParkingSlotStatus;

import java.util.List;

@Entity
@Table(name = "parking_slot")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParkingSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "slot_name", nullable = false, columnDefinition = "nvarchar(100)")
    private String slotName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ParkingSlotStatus status = ParkingSlotStatus.AVAILABLE;

    // ==================== Relationships ====================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "floor_id")
    private Floor floor;

    @OneToMany(mappedBy = "parkingSlot", fetch = FetchType.LAZY)
    private List<ParkingSession> parkingSessions;

    // @OneToMany(mappedBy = "parkingSlot", fetch = FetchType.LAZY)
    // private List<Booking> bookings; // Tạm ẩn cho đến khi có entity Booking
}
