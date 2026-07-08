package vn.edu.ut.pbms.entity;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.edu.ut.pbms.constant.ParkingSlotStatus;

@Entity
@Table(name = "parking_slot")
@Getter
@Setter
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
    private List<Booking> bookings;

    @OneToMany(mappedBy = "parkingSlot", fetch = FetchType.LAZY)
    private List<ParkingSession> parkingSessions;
}
