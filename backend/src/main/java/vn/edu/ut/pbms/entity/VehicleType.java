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
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.edu.ut.pbms.constant.VehicleTypeStatus;

/**
 * Entity representing a vehicle type category (e.g., Car, Motorcycle, Bicycle).
 * Maps to the "vehicle_type" table in the database.
 */
@Entity
@Table(name = "vehicle_type")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehicleType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "type_name", nullable = false, unique = true, columnDefinition = "nvarchar(100)")
    private String typeName;

    @Column(columnDefinition = "nvarchar(255)")
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
