package vn.edu.ut.pbms.service.impl;

import java.math.BigDecimal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.edu.ut.pbms.constant.PaymentStatus;
import vn.edu.ut.pbms.dto.report.RevenueReportDTO;
import vn.edu.ut.pbms.entity.Payment;
import vn.edu.ut.pbms.repository.ParkingSlotRepository;
import vn.edu.ut.pbms.repository.PaymentRepository;
import vn.edu.ut.pbms.service.ReportService;
import vn.edu.ut.pbms.constant.ParkingSlotStatus;
import vn.edu.ut.pbms.dto.report.OccupancyRateReportDTO;
import vn.edu.ut.pbms.dto.report.VehicleEntryExitReportDTO;
import vn.edu.ut.pbms.entity.ParkingSession;
import vn.edu.ut.pbms.repository.ParkingSessionRepository;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final ParkingSlotRepository parkingSlotRepository;

    private final ParkingSessionRepository parkingSessionRepository;

    private final PaymentRepository paymentRepository;
    @Override
    public OccupancyRateReportDTO getOccupancyRate() {

        long totalSlots = parkingSlotRepository.count();

        long occupiedSlots = parkingSlotRepository.countByStatus(ParkingSlotStatus.OCCUPIED);

        long availableSlots = parkingSlotRepository.countByStatus(ParkingSlotStatus.AVAILABLE);

        double occupancyRate = 0;

        if (totalSlots > 0) {
            occupancyRate = (occupiedSlots * 100.0) / totalSlots;
        }

        return OccupancyRateReportDTO.builder()
                .totalSlots(totalSlots)
                .occupiedSlots(occupiedSlots)
                .availableSlots(availableSlots)
                .occupancyRate(occupancyRate)
                .build();
    }

    @Override
    public List<VehicleEntryExitReportDTO> getVehicleEntryExitReport() {

        List<ParkingSession> sessions = parkingSessionRepository.findAll();

        return sessions.stream()
                .map(session -> VehicleEntryExitReportDTO.builder()
                        .ticketCode(session.getTicketCode())
                        .plate(session.getPlate())
                        .timeIn(session.getTimeIn())
                        .timeOut(session.getTimeOut())
                        .status(session.getStatus().name())
                        .build())
                .toList();
    }

    @Override
    public RevenueReportDTO getRevenueReport() {

        // Lấy tất cả các giao dịch thanh toán thành công
        List<Payment> payments = paymentRepository.findByStatus(PaymentStatus.SUCCESS);

        // Tính tổng doanh thu
        BigDecimal totalRevenue = payments.stream()
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Đếm số giao dịch thành công
        long totalTransactions = payments.size();

        // Trả kết quả về DTO
        return RevenueReportDTO.builder()
                .totalRevenue(totalRevenue)
                .totalTransactions(totalTransactions)
                .build();
    }
}