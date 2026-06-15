package vn.edu.ut.pbms.vehicle_type;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.edu.ut.pbms.pricing_policy.PricingPolicy;
import vn.edu.ut.pbms.vehicle.Vehicle;

import java.util.List;

/**
 * Entity representing a vehicle type category (e.g., Car, Motorcycle, Bicycle).
 * Maps to the "vehicle_type" table in the database.
 */
@Entity
@Table(name = "vehicle_type")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehicleType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "type_name", nullable = false, unique = true, length = 100)
    private String typeName;

    @Column(length = 255)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private VehicleTypeStatus status = VehicleTypeStatus.ACTIVE;

    // ==================== Relationships ====================

    /**
     * One vehicle type can have many pricing policies (1:N).
     */
    @OneToMany(mappedBy = "vehicleType", fetch = FetchType.LAZY)
    private List<PricingPolicy> pricingPolicies;

    /**
     * One vehicle type can classify many vehicles (1:N).
     */
    @OneToMany(mappedBy = "vehicleType", fetch = FetchType.LAZY)
    private List<Vehicle> vehicles;
}
