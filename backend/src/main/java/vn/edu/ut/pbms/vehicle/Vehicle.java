package vn.edu.ut.pbms.vehicle;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.edu.ut.pbms.vehicle_type.VehicleType;

/**
 * Stub entity for Vehicle.
 * Contains only the minimal fields needed for VehicleType relationships and E3 deactivation check.
 * TODO: Expand with full fields (license plate, color, owner, etc.) when implementing Vehicle feature.
 */
@Entity
@Table(name = "vehicle")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_type_id")
    private VehicleType vehicleType;
}
