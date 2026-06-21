package vn.edu.ut.pbms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entity đại diện cho bảng pricing_policy trong SQL Server.
 * Chính sách giá áp dụng riêng cho từng danh mục loại xe.
 */
@Entity
@Table(name = "pricing_policy")
@Data
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

    // ==================== Relationships ====================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_type_id")
    private VehicleType vehicleType;
}
