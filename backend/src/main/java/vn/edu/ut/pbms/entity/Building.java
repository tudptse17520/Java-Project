package vn.edu.ut.pbms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.edu.ut.pbms.constant.BuildingStatus;

import java.util.List;

@Entity
@Table(name = "building")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Building {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "building_name", nullable = false, columnDefinition = "nvarchar(100)")
    private String buildingName;

    @Column(nullable = false, columnDefinition = "nvarchar(255)")
    private String address;

    @Column(name = "number_of_floors", nullable = false)
    private Integer numberOfFloors;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private BuildingStatus status = BuildingStatus.ACTIVE;

    // ==================== Relationships ====================

    @OneToMany(mappedBy = "building", fetch = FetchType.LAZY)
    private List<Floor> floors;
}
