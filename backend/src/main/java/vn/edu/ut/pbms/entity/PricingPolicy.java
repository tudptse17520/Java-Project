package vn.edu.ut.pbms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import vn.edu.ut.pbms.constant.PricingPolicyStatus;

/**
 * Entity đại diện cho bảng pricing_policy trong SQL Server.
 * Chính sách giá áp dụng riêng cho từng danh mục loại xe.
 */
@Entity
@Table(name = "pricing_policy")
@SQLDelete(sql = "UPDATE pricing_policy SET status = 'INACTIVE' WHERE id = ?")
@SQLRestriction("status = 'ACTIVE'")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PricingPolicy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "base_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal basePrice;

    @Column(name = "extra_fee_per_hour", nullable = false, precision = 10, scale = 2)
    private BigDecimal extraFeePerHour;

    @Column(name = "effective_date", nullable = false)
    private LocalDateTime effectiveDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, columnDefinition = "VARCHAR(50) DEFAULT 'ACTIVE'")
    @Builder.Default
    private PricingPolicyStatus status = PricingPolicyStatus.ACTIVE;

    // ==================== Relationships ====================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_type_id")
    private VehicleType vehicleType;
}
