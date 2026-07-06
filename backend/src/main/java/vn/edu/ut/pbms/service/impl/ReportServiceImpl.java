package vn.edu.ut.pbms.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.edu.ut.pbms.repository.ParkingSlotRepository;
import vn.edu.ut.pbms.service.ReportService;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final ParkingSlotRepository parkingSlotRepository;
    @Override
    public OccupancyRateReportDTO getOccupancyRate() {
        // Đếm tổng số slot
        long totalSlots = parkingSlotRepository.count();

        // Đếm số slot đang được sử dụng
        long occupiedSlots = parkingSlotRepository.countByStatus(ParkingSlotStatus.OCCUPIED);

        // Đếm số slot còn trống
        long availableSlots = parkingSlotRepository.countByStatus(ParkingSlotStatus.AVAILABLE);

        // Tính tỷ lệ lấp đầy
        double occupancyRate = 0;

        if (totalSlots > 0) {
            occupancyRate = (occupiedSlots * 100.0) / totalSlots;
        }

        // Trả kết quả về DTO
        return OccupancyRateReportDTO.builder()
                .totalSlots(totalSlots)
                .occupiedSlots(occupiedSlots)
                .availableSlots(availableSlots)
                .occupancyRate(occupancyRate)
                .build();
    }
}