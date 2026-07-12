package vn.edu.ut.pbms.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import vn.edu.ut.pbms.constant.*;
import vn.edu.ut.pbms.entity.*;
import vn.edu.ut.pbms.repository.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Seeder khởi tạo dữ liệu mẫu cho hệ thống PBMS.
 * Cung cấp bộ dữ liệu thực tế, chuyên nghiệp phục vụ cho quá trình phát triển và demo ứng dụng.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    // Repositories
    private final UserRepository userRepository;
    private final VehicleTypeRepository vehicleTypeRepository;
    private final PricingPolicyRepository pricingPolicyRepository;
    private final BuildingRepository buildingRepository;
    private final FloorRepository floorRepository;
    private final ParkingSlotRepository parkingSlotRepository;
    private final VehicleRepository vehicleRepository;
    private final ParkingSessionRepository sessionRepository;
    private final PaymentRepository paymentRepository;
    private final FeedbackRepository feedbackRepository;
    private final BookingRepository bookingRepository;
    private final PasswordEncoder passwordEncoder;
    private final org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    @Override
    @Transactional
    public void run(String... args) {
        log.info("=== BẮT ĐẦU CHẠY DATABASE SEEDER (DỮ LIỆU THỰC TẾ) ===");

        // Xóa sạch dữ liệu cũ để nạp lại một cách triệt để
        log.info("Đang xóa dữ liệu cũ...");
        try {
            jdbcTemplate.execute("EXEC sp_MSforeachtable \"ALTER TABLE ? NOCHECK CONSTRAINT all\"");
            jdbcTemplate.execute("EXEC sp_MSforeachtable \"DELETE FROM ?\"");
            jdbcTemplate.execute("EXEC sp_MSforeachtable \"ALTER TABLE ? WITH CHECK CHECK CONSTRAINT all\"");
            log.info("Đã xóa sạch dữ liệu cũ.");
        } catch (Exception e) {
            log.warn("Không thể xóa dữ liệu cũ bằng sp_MSforeachtable. Đang thử xóa bằng JPA...");
            feedbackRepository.deleteAll();
            paymentRepository.deleteAll();
            sessionRepository.deleteAll();
            bookingRepository.deleteAll();
            vehicleRepository.deleteAll();
            parkingSlotRepository.deleteAll();
            floorRepository.deleteAll();
            buildingRepository.deleteAll();
            pricingPolicyRepository.deleteAll();
            vehicleTypeRepository.deleteAll();
            userRepository.deleteAll();
        }

        if (userRepository.count() > 0) {
            log.info("Không thể xóa dữ liệu cũ. Bỏ qua Seeder.");
            return;
        }

        List<User> users = seedUsers();
        List<VehicleType> vehicleTypes = seedVehicleTypesAndPricing();
        List<ParkingSlot> slots = seedInfrastructure(vehicleTypes);
        List<Vehicle> vehicles = seedVehicles(users, vehicleTypes);
        seedOperations(users, vehicles, slots);

        log.info("=== KẾT THÚC CHẠY DATABASE SEEDER THÀNH CÔNG ===");
    }

    private List<User> seedUsers() {
        log.info("Đang tạo danh sách Tài khoản Hệ thống & Khách hàng...");
        String defaultPassword = passwordEncoder.encode("password");

        List<User> users = List.of(
                // Tài khoản nội bộ (Test nhanh)
                User.builder().username("admin").password(defaultPassword).fullName("Nguyễn Trần Quản Trị").phoneNumber("0901234567").role(Role.ADMIN).status(UserStatus.ACTIVE).build(),
                User.builder().username("manager").password(defaultPassword).fullName("Lê Trọng Quản Lý").phoneNumber("0912345678").role(Role.MANAGER).status(UserStatus.ACTIVE).build(),
                User.builder().username("staff").password(defaultPassword).fullName("Phạm Văn Nhân Viên").phoneNumber("0923456789").role(Role.STAFF).status(UserStatus.ACTIVE).build(),
                User.builder().username("user").password(defaultPassword).fullName("Trần Khách Hàng").phoneNumber("0934567890").role(Role.USER).status(UserStatus.ACTIVE).build(),
                
                // Khách hàng thực tế
                User.builder().username("thanh.tu").password(defaultPassword).fullName("Đoàn Phạm Thanh Tú").phoneNumber("0987654321").role(Role.USER).status(UserStatus.ACTIVE).build(),
                User.builder().username("hoang.nam").password(defaultPassword).fullName("Trần Hoàng Nam").phoneNumber("0888123456").role(Role.USER).status(UserStatus.ACTIVE).build(),
                User.builder().username("minh.nguyet").password(defaultPassword).fullName("Lê Thị Minh Nguyệt").phoneNumber("0777987654").role(Role.USER).status(UserStatus.ACTIVE).build(),
                User.builder().username("bao.quoc").password(defaultPassword).fullName("Ngô Bảo Quốc").phoneNumber("0965111222").role(Role.USER).status(UserStatus.ACTIVE).build()
        );
        return userRepository.saveAll(users);
    }

    private List<VehicleType> seedVehicleTypesAndPricing() {
        log.info("Đang cấu hình Danh mục Loại xe & Bảng giá tiêu chuẩn...");
        
        VehicleType bicycle = VehicleType.builder().typeName("Xe Đạp / Xe Đạp Điện").description("Các loại xe thô sơ, xe đạp điện không biển số").status(VehicleTypeStatus.ACTIVE).build();
        VehicleType motorbike = VehicleType.builder().typeName("Xe Máy Phổ Thông").description("Xe số, xe tay ga phổ thông dưới 150cc").status(VehicleTypeStatus.ACTIVE).build();
        VehicleType car4Seat = VehicleType.builder().typeName("Ô Tô 4-5 Chỗ").description("Xe hơi gia đình loại nhỏ và vừa").status(VehicleTypeStatus.ACTIVE).build();
        VehicleType car7Seat = VehicleType.builder().typeName("Ô Tô 7 Chỗ / SUV").description("Xe thể thao đa dụng, xe hơi 7 chỗ cỡ lớn").status(VehicleTypeStatus.ACTIVE).build();
        
        List<VehicleType> savedTypes = vehicleTypeRepository.saveAll(List.of(bicycle, motorbike, car4Seat, car7Seat));

        List<PricingPolicy> policies = List.of(
            PricingPolicy.builder().vehicleType(savedTypes.get(0)).basePrice(BigDecimal.valueOf(2000)).extraFeePerHour(BigDecimal.valueOf(1000)).effectiveDate(LocalDateTime.now().minusMonths(6)).status(PricingPolicyStatus.ACTIVE).build(),
            PricingPolicy.builder().vehicleType(savedTypes.get(1)).basePrice(BigDecimal.valueOf(5000)).extraFeePerHour(BigDecimal.valueOf(2000)).effectiveDate(LocalDateTime.now().minusMonths(6)).status(PricingPolicyStatus.ACTIVE).build(),
            PricingPolicy.builder().vehicleType(savedTypes.get(2)).basePrice(BigDecimal.valueOf(30000)).extraFeePerHour(BigDecimal.valueOf(15000)).effectiveDate(LocalDateTime.now().minusMonths(6)).status(PricingPolicyStatus.ACTIVE).build(),
            PricingPolicy.builder().vehicleType(savedTypes.get(3)).basePrice(BigDecimal.valueOf(40000)).extraFeePerHour(BigDecimal.valueOf(20000)).effectiveDate(LocalDateTime.now().minusMonths(6)).status(PricingPolicyStatus.ACTIVE).build()
        );
        pricingPolicyRepository.saveAll(policies);

        return savedTypes;
    }

    private List<ParkingSlot> seedInfrastructure(List<VehicleType> types) {
        log.info("Đang thiết lập Cơ sở hạ tầng bãi đỗ phức hợp (Vincom Landmark 81)...");

        Building landmark81 = Building.builder()
                .buildingName("PBMS Landmark 81 Parking")
                .address("208 Nguyễn Hữu Cảnh, Phường 22, Bình Thạnh, TP.HCM")
                .numberOfFloors(3).status(BuildingStatus.ACTIVE).build();
        landmark81 = buildingRepository.save(landmark81);

        Floor b1Car = Floor.builder().building(landmark81).vehicleType(types.get(2)).floorName("Tầng Hầm B1 (Ô tô)").floorLevel(-1).capacity(30).status(FloorStatus.ACTIVE).build();
        Floor b2Car = Floor.builder().building(landmark81).vehicleType(types.get(3)).floorName("Tầng Hầm B2 (VIP SUV)").floorLevel(-2).capacity(20).status(FloorStatus.ACTIVE).build();
        Floor b3Moto = Floor.builder().building(landmark81).vehicleType(types.get(1)).floorName("Tầng Hầm B3 (Xe máy)").floorLevel(-3).capacity(100).status(FloorStatus.ACTIVE).build();
        
        List<Floor> savedFloors = floorRepository.saveAll(List.of(b1Car, b2Car, b3Moto));

        List<ParkingSlot> slots = new ArrayList<>();
        
        // Tạo 30 Slot B1 cho Ô tô 4 chỗ
        for (int i = 1; i <= 30; i++) {
            ParkingSlotStatus status = (i <= 5) ? ParkingSlotStatus.OCCUPIED : (i > 5 && i <= 8) ? ParkingSlotStatus.RESERVED : ParkingSlotStatus.AVAILABLE;
            slots.add(ParkingSlot.builder().floor(savedFloors.get(0)).slotName("B1-A" + String.format("%03d", i)).status(status).build());
        }

        // Tạo 20 Slot B2 cho SUV/7 chỗ (Có 1 slot bảo trì)
        for (int i = 1; i <= 20; i++) {
            ParkingSlotStatus status = (i == 10) ? ParkingSlotStatus.MAINTENANCE : ParkingSlotStatus.AVAILABLE;
            slots.add(ParkingSlot.builder().floor(savedFloors.get(1)).slotName("B2-VIP" + String.format("%02d", i)).status(status).build());
        }

        // Tạo 100 Slot B3 cho Xe Máy (Mẫu 20 slot đầu)
        for (int i = 1; i <= 20; i++) {
            slots.add(ParkingSlot.builder().floor(savedFloors.get(2)).slotName("B3-M" + String.format("%03d", i)).status(ParkingSlotStatus.AVAILABLE).build());
        }

        return parkingSlotRepository.saveAll(slots);
    }

    private List<Vehicle> seedVehicles(List<User> users, List<VehicleType> types) {
        log.info("Đang đăng ký biển số phương tiện cho cư dân & khách hàng...");
        
        User thanhTu = users.get(4);
        User hoangNam = users.get(5);
        User minhNguyet = users.get(6);
        User baoQuoc = users.get(7);

        List<Vehicle> vehicles = List.of(
            Vehicle.builder().user(thanhTu).vehicleType(types.get(1)).plate("59T1-888.88").brand("Honda SH 150i").color("Đỏ Nhám").build(),
            Vehicle.builder().user(hoangNam).vehicleType(types.get(2)).plate("51G-123.45").brand("Mazda 3").color("Trắng ngọc trai").build(),
            Vehicle.builder().user(minhNguyet).vehicleType(types.get(3)).plate("51H-999.99").brand("Ford Everest").color("Đen tuyền").build(),
            Vehicle.builder().user(baoQuoc).vehicleType(types.get(1)).plate("61B1-456.78").brand("Yamaha Exciter 155").color("Xanh GP").build(),
            Vehicle.builder().user(thanhTu).vehicleType(types.get(2)).plate("51K-789.10").brand("Toyota Camry 2.5Q").color("Đen").build()
        );

        return vehicleRepository.saveAll(vehicles);
    }

    private void seedOperations(List<User> users, List<Vehicle> vehicles, List<ParkingSlot> slots) {
        log.info("Đang giả lập luồng giao dịch: Booking, Check-in, Check-out, Thanh toán & Phản hồi...");

        User thanhTu = users.get(4);
        User hoangNam = users.get(5);
        User minhNguyet = users.get(6);

        Vehicle sh150i = vehicles.get(0);
        Vehicle mazda3 = vehicles.get(1);
        Vehicle fordEverest = vehicles.get(2);
        Vehicle camry = vehicles.get(4);

        // 1. Đặt chỗ trước (Booking)
        Booking booking1 = Booking.builder().user(minhNguyet).vehicle(fordEverest).parkingSlot(slots.get(30)) // Slot B2-VIP01
                .expectedTimeIn(LocalDateTime.now().plusHours(1)).expectedTimeOut(LocalDateTime.now().plusHours(8))
                .status(BookingStatus.CONFIRMED).build();
        bookingRepository.save(booking1);

        // 2. Xe đang đậu trong bãi (In Progress)
        ParkingSession session1 = ParkingSession.builder()
                .ticketCode("TK-B1-20260712-001").plate(mazda3.getPlate()).user(hoangNam).vehicle(mazda3)
                .timeIn(LocalDateTime.now().minusHours(3))
                .parkingSlot(slots.get(0)).status(ParkingSessionStatus.IN_PROGRESS).build();
        sessionRepository.save(session1);

        ParkingSession session2 = ParkingSession.builder()
                .ticketCode("TK-B1-20260712-002").plate(camry.getPlate()).user(thanhTu).vehicle(camry)
                .timeIn(LocalDateTime.now().minusHours(1))
                .parkingSlot(slots.get(1)).status(ParkingSessionStatus.IN_PROGRESS).build();
        sessionRepository.save(session2);

        // 3. Khách đã ra khỏi bãi & Hoàn tất thanh toán (Completed)
        ParkingSession session3 = ParkingSession.builder()
                .ticketCode("TK-B3-20260712-099").plate(sh150i.getPlate()).user(thanhTu).vehicle(sh150i)
                .timeIn(LocalDateTime.now().minusHours(5)).timeOut(LocalDateTime.now().minusMinutes(15))
                .parkingSlot(slots.get(50)).status(ParkingSessionStatus.COMPLETED)
                .totalFee(BigDecimal.valueOf(11000)).build(); // 5000 + 3*2000 extra
        session3 = sessionRepository.save(session3);

        Payment payment1 = Payment.builder()
                .parkingSession(session3).amount(BigDecimal.valueOf(11000))
                .paymentMethod(PaymentMethod.Vnpay).paymentTime(LocalDateTime.now().minusMinutes(14)).status(PaymentStatus.SUCCESS)
                .feeType(FeeType.PARKING_FEE).build();
        paymentRepository.save(payment1);

        // 4. Phản hồi / Sự cố từ khách hàng
        Feedback feedback1 = Feedback.builder()
                .parkingSession(session3).issueType(IssueType.LOST_TICKET)
                .description("Hệ thống nhận diện biển số 59T1-888.88 bị nhòe camera do sương mù, khách đã báo bảo vệ quẹt thẻ phụ.")
                .status(FeedbackStatus.RESOLVED).build();
        feedbackRepository.save(feedback1);
        
        Feedback feedback2 = Feedback.builder()
                .parkingSession(session1).issueType(IssueType.WRONG_PLACE)
                .description("Xe Mazda 3 đậu lấn vạch sang Slot kế bên, yêu cầu nhân viên tuần tra nhắc nhở qua loa.")
                .status(FeedbackStatus.PROCESSING).build();
        feedbackRepository.save(feedback2);
    }
}
