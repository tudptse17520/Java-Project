package vn.edu.ut.pbms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.edu.ut.pbms.constant.PricingPolicyStatus;

/**
 * Stub entity for PricingPolicy.
 * Contains only the minimal fields needed for VehicleType deactivation check (E3).
 * TODO: Expand with full fields when implementing Pricing Policy feature.
 */
@Entity
@Table(name = "pricing_policy")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PricingPolicy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_type_id")
    private VehicleType vehicleType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PricingPolicyStatus status;
}
