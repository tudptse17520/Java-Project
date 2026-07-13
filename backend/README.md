# Backend Structure

```text
vn\edu\ut\pbms
├── config/       # Cấu hình CORS, Async, Swagger và Security (JWT)
├── constant/     # Chứa các Enum (SlotStatus, VehicleType,...)
├── controller/   # Nơi tiếp nhận request từ React/Next.js
├── dto/          # Dữ liệu luân chuyển giữa FE và BE
│   ├── request/
│   └── response/
├── entity/       # Map trực tiếp với các bảng trong SQL Server
├── exception/    # Xử lý lỗi tập trung (GlobalExceptionHandler)
├── repository/   # Giao tiếp với SQL Server thông qua JPA
├── service/      # Nơi xử lý logic (Tính phí bãi xe, ...)
│   └── impl/     # Hiện thực hóa các Interface của Service
└── util/         # Các hàm tiện ích (mã hóa mật khẩu, xử lý chuỗi, định dạng ngày tháng)
```

## Prerequisites
- Java 21
- Maven
- SQL Server

## Setup & Run
1. Navigate to the backend directory:
   ```bash
   cd backend/
   ```
2. Set up environment variables:
   Copy `.env.example` to `.env` and update the values (e.g., database credentials, JWT secret).
3. Install dependencies and build the project:
   ```bash
   .\mvnw clean install
   ```
4. Run the application:
   ```bash
   .\mvnw spring-boot:run
   ```
The backend server will start on `http://localhost:8080`.
