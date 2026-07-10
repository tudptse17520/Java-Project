# Tài liệu Đặc tả Hệ thống API - Hệ thống PBMS

Tài liệu này mô tả chi tiết các API endpoints thuộc hệ thống Quản lý Tòa nhà Gửi xe (Parking Building Management System).

* **Mặc định Headers:** `Content-Type: application/json`

---

## 1. Phân hệ Tài khoản & Xác thực (Authentication & Users)

### 1.1. API create_user (Tạo tài khoản người dùng)
* **Method:** `POST`
* **URL:** `http://localhost:8080/api/v1/users`

**Dữ liệu truyền vào API:**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `username` | String | Tên tài khoản người dùng |
| `password` | String | Mật khẩu đăng nhập |
| `fullName` | String | Họ và tên người dùng |
| `phoneNumber` | String | Số điện thoại liên hệ (Unique) |
| `role` | String | Vai trò (ADMIN, MANAGER, STAFF, USER) |

**Dữ liệu API trả về:**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `id` | int | Mã định danh người dùng được hệ thống tự động tạo |
| `message` | String | Thông báo trạng thái |

---

### 1.2. API login (Đăng nhập hệ thống)
* **Method:** `POST`
* **URL:** `http://localhost:8080/api/v1/auth/login`

**Dữ liệu truyền vào API:**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `username` | String | Tên tài khoản đăng nhập |
| `password` | String | Mật khẩu đăng nhập |

**Dữ liệu API trả về:**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `token` | String | Chuỗi JWT Token dùng để xác thực các request |
| `message` | String | Thông báo trạng thái |
| `role` | String | Vai trò của người dùng để phân quyền giao diện |

---

### 1.3. API get_users (Xem danh sách tài khoản)
* **Method:** `GET`
* **URL:** `http://localhost:8080/api/v1/users`
* **Mô tả:** Dành cho System Administrator quản lý người dùng.

**Dữ liệu truyền vào API (Query Parameters):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `role` | String | (Tùy chọn) Lọc theo vai trò (ADMIN, MANAGER, STAFF, USER) |
| `keyword` | String | (Tùy chọn) Tìm kiếm theo tên hoặc số điện thoại |

**Dữ liệu API trả về:**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `total_items` | int | Tổng số lượng tài khoản tìm thấy |
| `data` | Array/List | Danh sách chi tiết các tài khoản (id, username, fullName, role...) |
| `message` | String | Thông báo trạng thái |

---

## 2. Phân hệ Cơ sở hạ tầng (Infrastructure Management)

### 2.1. API create_building (Thêm tòa nhà/bãi xe mới)
* **Method:** `POST`
* **URL:** `http://localhost:8080/api/v1/buildings`

**Dữ liệu truyền vào API:**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `building_name` | String | Tên hiển thị của tòa nhà / bãi xe |
| `address` | String | Địa chỉ của tòa nhà / bãi xe |
| `number_of_floors` | int | Tổng số tầng của tòa nhà |
| `status` | String | Trạng thái hoạt động (ACTIVE, MAINTENANCE, INACTIVE) |

**Dữ liệu API trả về:**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `id` | int | Mã định danh tòa nhà |
| `message` | String | Thông báo trạng thái |

---

### 2.2. API create_floor (Thêm tầng đỗ xe)
* **Method:** `POST`
* **URL:** `http://localhost:8080/api/v1/floors`

**Dữ liệu truyền vào API:**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `building_id` | int | Mã định danh tòa nhà chứa tầng này |
| `vehicle_type_id` | int | Mã định danh loại phương tiện được phép đỗ ở tầng này |
| `floor_name` | String | Tên hiển thị của tầng (VD: Tầng hầm B1) |
| `floor_level` | int | Cấp độ tầng (VD: -1, 1, 2) |
| `capacity` | int | Sức chứa tổng số xe của tầng |
| `status` | String | Trạng thái hoạt động ban đầu (ACTIVE, MAINTENANCE, LOCKED) |

**Dữ liệu API trả về:**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `id` | int | Mã định danh tầng |
| `message` | String | Thông báo trạng thái |

---

### 2.3. API create_parking_slot (Thêm vị trí đỗ xe - Slot)
* **Method:** `POST`
* **URL:** `http://localhost:8080/api/v1/slots`

**Dữ liệu truyền vào API:**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `floor_id` | int | Mã định danh tầng chứa vị trí này |
| `slot_name` | String | Tên/Mã vị trí đỗ (VD: A01, B12) |
| `status` | String | Trạng thái vị trí (AVAILABLE, OCCUPIED, RESERVED, MAINTENANCE, LOCKED) |

**Dữ liệu API trả về:**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `id` | int | Mã định danh vị trí đỗ |
| `message` | String | Thông báo trạng thái |

---

### 2.4. API update_slot_status (Cập nhật trạng thái vị trí đỗ xe)
* **Method:** `PATCH`
* **URL:** `http://localhost:8080/api/v1/slots/{id}/status`

**Dữ liệu truyền vào API:**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `status` | String | Trạng thái mới muốn cập nhật (AVAILABLE, OCCUPIED, RESERVED, MAINTENANCE, LOCKED) |

**Dữ liệu API trả về:**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `id` | int | Mã định danh vị trí đỗ (Parking Slot ID) vừa cập nhật |
| `status` | String | Trạng thái mới đã được cập nhật thành công |
| `message` | String | Thông báo trạng thái |

---

### 2.5. API get_buildings_and_floors (Xem thông tin tòa nhà và danh sách tầng)
* **Method:** `GET`
* **URL:** `http://localhost:8080/api/v1/buildings`
* **Mô tả:** Dành cho Parking Manager và hiển thị lên WebApp cho User xem cấu trúc bãi xe.

**Dữ liệu truyền vào API:**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `status` | String | (Tùy chọn) Lọc bãi xe theo trạng thái hoạt động (ACTIVE, MAINTENANCE, INACTIVE) |

**Dữ liệu API trả về:**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `data` | Array/List | Danh sách chi tiết các tòa nhà (id, building_name, address, status) kèm mảng danh sách tầng (id, floor_name, floor_level, capacity, status) |
| `message` | String | Thông báo trạng thái |

---

### 2.6. API get_slots (Xem và tìm kiếm vị trí đỗ xe / slot trống)
* **Method:** `GET`
* **URL:** `http://localhost:8080/api/v1/slots`
* **Mô tả:** Phục vụ Use Case Tìm kiếm slot, Xem danh sách slot và User xem chỗ trống.

**Dữ liệu truyền vào API (Query Parameters):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `floor_id` | int | (Tùy chọn) Lọc slot theo tầng cụ thể |
| `status` | String | (Tùy chọn) Lọc theo trạng thái (AVAILABLE, OCCUPIED, RESERVED, MAINTENANCE, LOCKED) |

**Dữ liệu API trả về:**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `total_available` | int | Tổng số lượng chỗ còn trống |
| `data` | Array/List | Danh sách chi tiết các slot (id, slot_name, status) |

---

## 3. Phân hệ Phương tiện & Định giá (Vehicles & Pricing)

### 3.1. API create_vehicle_type (Thêm danh mục loại xe)
* **Method:** `POST`
* **URL:** `http://localhost:8080/api/v1/vehicle-types`

**Dữ liệu truyền vào API:**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `type_name` | String | Tên danh mục (VD: Ô tô 4 chỗ, 7 chỗ, Xe máy, số, tay ga) |
| `description` | String | Mô tả chi tiết (nếu có) |
| `status` | String | Trạng thái áp dụng (ACTIVE, INACTIVE) |

**Dữ liệu API trả về:**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `id` | int | Mã định danh danh mục loại xe |
| `message` | String | Thông báo trạng thái |

---

### 3.2. API create_pricing_policy (Thiết lập bảng giá/Chính sách giá)
* **Method:** `POST`
* **URL:** `http://localhost:8080/api/v1/pricing-policies`

**Dữ liệu truyền vào API:**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `vehicle_type_id` | int | Mã định danh danh mục loại xe áp dụng |
| `base_price` | BigDecimal | Giá cơ bản (Phí gửi khoảng thời gian đầu, ví dụ có thể set 1 vé được 4 tiếng đỗ) |
| `extra_fee_per_hour` | BigDecimal | Phí phụ thu cho mỗi giờ tiếp theo |
| `effective_date` | String | Ngày bắt đầu áp dụng bảng giá (Định dạng DD-MM-YYYY) |

**Dữ liệu API trả về:**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `id` | int | Mã định danh bảng giá |
| `message` | String | Thông báo trạng thái |

---

### 3.3. API get_pricing_policies (Xem bảng giá / Quy định tính phí)
* **Method:** `GET`
* **URL:** `http://localhost:8080/api/v1/pricing-policies`
* **Mô tả:** Staff cần gọi API này để hệ thống tính tiền, Manager gọi để xem danh sách bảng giá.

**Dữ liệu truyền vào API (Query Parameters):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `vehicle_type_id` | int | (Tùy chọn) Truy vấn bảng giá của riêng một loại xe (VD: Giá cho ô tô) |

**Dữ liệu API trả về:**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `data` | Array/List | Danh sách bảng giá (base_price, extra_fee_per_hour, effective_date) |

---

### 3.4. API create_vehicle (Khách hàng đăng ký xe cá nhân)
* **Method:** `POST`
* **URL:** `http://localhost:8080/api/v1/vehicles`

**Dữ liệu truyền vào API:**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `user_id` | int | Mã định danh khách hàng chủ xe |
| `vehicle_type_id` | int | Mã định danh danh mục loại xe |
| `plate` | String | Biển số xe (Unique) |
| `brand` | String | Hãng sản xuất (Honda, Toyota...) |
| `color` | String | Màu sắc xe |

**Dữ liệu API trả về:**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `id` | int | Mã định danh phương tiện |
| `message` | String | Thông báo trạng thái |

---

## 4. Phân hệ Nghiệp vụ đỗ xe cốt lõi (Operations)

### 4.1. API create_booking (Đặt chỗ trước)
* **Method:** `POST`
* **URL:** `http://localhost:8080/api/v1/bookings`

**Dữ liệu truyền vào API:**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `user_id` | int | Mã định danh khách hàng |
| `vehicle_id` | int | Mã định danh xe của khách |
| `parking_slot_id` | int | Mã định danh vị trí đỗ muốn đặt |
| `expected_time_in` | String | Thời gian dự kiến vào bãi |
| `expected_time_out` | String | Thời gian dự kiến ra bãi |

**Dữ liệu API trả về:**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `id` | int | Mã định danh đơn đặt chỗ |
| `status` | String | Trạng thái ban đầu của đơn đặt chỗ (PENDING) |
| `message` | String | Thông báo trạng thái |

---

### 4.2. API get_user_bookings (Xem danh sách đặt chỗ của User)
* **Method:** `GET`
* **URL:** `http://localhost:8080/api/v1/users/{user_id}/bookings`
* **Mô tả:** Dành cho User kiểm tra các lệnh Đặt chỗ trước của chính mình.

**Dữ liệu API trả về:**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `data` | Array/List | Lịch sử đặt chỗ (booking_id, parking_slot_id, expected_time_in, status) |

---

### 4.3. API check_in (Tạo lượt gửi xe - Xe vào bãi)
* **Method:** `POST`
* **URL:** `http://localhost:8080/api/v1/sessions/check-in`

**Dữ liệu truyền vào API:**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `plate` | String | Biển số xe nhập tại cổng vào |
| `vehicle_id` | int | Mã định danh xe (Nullable, truyền nếu là xe thành viên đã đăng ký) |
| `parking_slot_id` | int | Mã định danh vị trí đỗ (Nullable, chỉ truyền nếu đi từ luồng đặt chỗ trước) |

**Dữ liệu API trả về:**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `id` | int | Mã định danh lượt gửi xe (Parking Session) |
| `ticket_code` | String | Mã vé điện tử của lượt gửi (Dùng để sinh mã QR trên Web App) |
| `time_in` | String | Thời gian xe vào bãi (Timestamp) |
| `status` | String | Trạng thái lượt gửi (IN_PROGRESS) |
| `message` | String | Thông báo trạng thái |

---

### 4.4. API check_out (Xử lý xe ra bãi)
* **Method:** `PUT`
* **URL:** `http://localhost:8080/api/v1/sessions/{session_id}/check-out`

**Dữ liệu truyền vào API:**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `time_out` | String | Thời gian xe ra bãi (Timestamp) |

**Dữ liệu API trả về:**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `session_id` | int | Mã định danh lượt gửi xe |
| `time_in` | String | Thời gian vào bãi |
| `time_out` | String | Thời gian ra bãi |
| `total_fee` | BigDecimal | Tổng số tiền phí cần thanh toán (Hệ thống tự tính dựa vào bảng giá) |
| `status` | String | Trạng thái cập nhật (COMPLETED) |

---

### 4.5. API get_parking_sessions (Theo dõi lượt gửi / Tra cứu xe)
* **Method:** `GET`
* **URL:** `http://localhost:8080/api/v1/sessions`
* **Mô tả:** Staff dùng để tìm xe lúc ra, Manager dùng để "Theo dõi xe quá giờ".

**Dữ liệu truyền vào API (Query Parameters):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `plate` | String | (Tùy chọn) Tìm kiếm chính xác theo biển số |
| `status` | String | (Tùy chọn) Trạng thái lượt gửi (IN_PROGRESS: đang trong bãi, COMPLETED: đã ra) |
| `from_date` | String | (Tùy chọn) Lọc thời gian vào bãi từ ngày... |

**Dữ liệu API trả về:**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `total_items` | int | Số lượng lượt gửi thỏa điều kiện |
| `data` | Array/List | Thông tin lượt gửi (id, plate, time_in, time_out, total_fee) |

---

## 5. Phân hệ Giao dịch & Sự cố (Billing & Feedbacks)

### 5.1. API create_payment (Tạo thanh toán)
* **Method:** `POST`
* **URL:** `http://localhost:8080/api/v1/payments`

**Dữ liệu truyền vào API:**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `parking_session_id` | int | Mã định danh lượt gửi xe tương ứng (hoặc mã booking) |
| `booking_id` | int | Mã định danh đơn đặt chỗ (Nullable, dùng khi cọc từ xa trên Web) |
| `amount` | BigDecimal | Số tiền thanh toán |
| `payment_method` | String | Hình thức (Cash, Momo, Vnpay, Credit_Card) |
| `fee_type` | String | Loại phí (Parking_Fee, Booking_Deposit, Lost_Ticket_Fine) |

**Dữ liệu API trả về:**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `id` | int | Mã định danh biên lai / giao dịch thanh toán |
| `payment_time` | String | Thời gian hoàn tất giao dịch |
| `status` | String | Trạng thái giao dịch (PENDING, SUCCESS, FAILED) |

---

### 5.2. API create_feedback (Ghi nhận sự cố / Báo cáo ngoại lệ)
* **Method:** `POST`
* **URL:** `http://localhost:8080/api/v1/feedbacks`

**Dữ liệu truyền vào API:**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `parking_session_id` | int | Mã định danh lượt gửi xe xảy ra sự cố |
| `issue_type` | String | Phân loại sự cố (LOST_TICKET, WRONG_PLATE, OVERTIME, WRONG_PLACE, UNPAID_EXIT) |
| `description` | String | Mô tả chi tiết vấn đề |
| `status` | String | Trạng thái xử lý sự cố (REPORTED, PROCESSING, RESOLVED) |

**Dữ liệu API trả về:**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `id` | int | Mã định danh phiếu báo cáo sự cố |
| `message` | String | Thông báo trạng thái |

---

### 5.3. API get_feedbacks (Xem danh sách sự cố bãi xe)
* **Method:** `GET`
* **URL:** `http://localhost:8080/api/v1/feedbacks`
* **Mô tả:** Manager dùng để kiểm tra các ngoại lệ (mất thẻ, đậu sai).

**Dữ liệu truyền vào API (Query Parameters):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `issue_type` | String | (Tùy chọn) Lọc theo loại sự cố (LOST_TICKET, WRONG_PLATE, OVERTIME, WRONG_PLACE, UNPAID_EXIT) |
| `status` | String | (Tùy chọn) Lọc theo trạng thái xử lý (REPORTED, PROCESSING, RESOLVED) |

**Dữ liệu API trả về:**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `data` | Array/List | Danh sách báo cáo sự cố kèm thông tin session_id liên quan |

---

## 6. Phân hệ Nghiệp vụ nâng cao & Xử lý ngoại lệ (Advanced Operations)

### 6.1. API resolve_lost_ticket (Xử lý mất vé)
* **Method:** `POST`
* **URL:** `http://localhost:8080/api/v1/sessions/{session_id}/lost-ticket`

**Dữ liệu truyền vào API:**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `session_id` | int | (Path Parameter) Mã định danh lượt gửi xe |
| `staff_id` | int | (Body) Mã định danh nhân viên trực bốt xử lý |
| `note` | String | (Body) Ghi chú xác minh giấy tờ xe (Bắt buộc) |

**Dữ liệu API trả về:**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `base_fee` | BigDecimal | Phí gửi xe gốc |
| `penalty_fee` | BigDecimal | Phí phạt mất thẻ |
| `total_fee` | BigDecimal | Tổng số tiền cần thanh toán |
| `message` | String | Thông báo trạng thái |

---

### 6.2. API check_out_validation (Xử lý ra bãi - Phát hiện sai biển số)
* **Method:** `POST`
* **URL:** `http://localhost:8080/api/v1/sessions/{session_id}/validate-plate`

**Dữ liệu truyền vào API:**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `session_id` | int | (Path Parameter) Mã định danh lượt gửi xe |
| `plate_out` | String | (Body) Biển số xe quét được lúc ra cổng |
| `plate_out_image` | String | (Body) Đường dẫn hình ảnh biển số lúc ra để đối chiếu |

**Dữ liệu API trả về (Trả về HTTP 409 Conflict khi phát hiện sai lệch):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `error_code` | String | Mã lỗi (LICENSE_PLATE_MISMATCH) |
| `message` | String | Cảnh báo sai lệch biển số, chặn mở cổng |

---

### 6.3. API override_checkout (Xử lý sai biển số - Bỏ qua lỗi)
* **Method:** `POST`
* **URL:** `http://localhost:8080/api/v1/sessions/{session_id}/override-checkout`

**Dữ liệu truyền vào API:**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `session_id` | int | (Path Parameter) Mã định danh lượt gửi xe |
| `staff_id` | int | (Body) Mã định danh nhân viên xác nhận cho qua |
| `override_reason` | String | (Body) Lý do bỏ qua lỗi (Ví dụ: "Đã kiểm tra giấy tờ") |

**Dữ liệu API trả về:**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `session_id` | int | Mã định danh lượt gửi xe |
| `status` | String | Trạng thái cập nhật (COMPLETED) |
| `message` | String | Thông báo đóng phiên thành công, mở cổng |

---

### 6.4. API calculate_fee (Xử lý đỗ quá giờ - Tính cước trước khi ra)
* **Method:** `POST`
* **URL:** `http://localhost:8080/api/v1/sessions/{session_id}/calculate-fee`

**Dữ liệu truyền vào API (Path Parameters):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `session_id` | int | (Path Parameter) Mã định danh lượt gửi xe |

**Dữ liệu API trả về:**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `base_fee` | BigDecimal | Số tiền phí cơ bản theo gói/vé ban đầu |
| `overtime_fee` | BigDecimal | Số tiền phụ thu do đỗ lố giờ (Nếu có) |
| `total_fee` | BigDecimal | Tổng tiền cước cần thanh toán |
| `message` | String | Thông báo trạng thái |

---

### 6.5. API create_violation (Xử lý đỗ sai vị trí)
* **Method:** `POST`
* **URL:** `http://localhost:8080/api/v1/violations`

**Dữ liệu truyền vào API:**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `session_id` | int | Mã định danh lượt gửi xe vi phạm |
| `expected_floor_id` | int | Mã định danh tầng được cấp phép đỗ ban đầu |
| `actual_floor_id` | int | Mã định danh tầng thực tế xe đang đỗ sai |
| `evidence_image` | String | Hình ảnh bằng chứng đỗ sai vị trí do staff chụp |

**Dữ liệu API trả về:**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `id` | int | Mã định danh biên bản vi phạm được tạo |
| `message` | String | Thông báo trạng thái ghi nhận thành công |

---

### 6.6. API check_exit_gate (Xử lý xe ra chưa thanh toán)
* **Method:** `POST`
* **URL:** `http://localhost:8080/api/v1/sessions/{session_id}/exit-gate`

**Dữ liệu truyền vào API (Path Parameters):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `session_id` | int | Mã định danh lượt gửi xe đang yêu cầu mở cổng ra |

**Dữ liệu API trả về (Trả về HTTP 402 Payment Required khi phát hiện chưa thanh toán đủ):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `error_code` | String | Mã lỗi (UNPAID_EXIT) |
| `message` | String | Thông báo yêu cầu khách thanh toán toàn bộ dư nợ trước khi ra cổng |

---

## 7. Phân hệ Thống kê & Báo cáo (Reports & Analytics)

### 7.1. API get_revenue_report (Xem doanh thu)
* **Method:** `GET`
* **URL:** `http://localhost:8080/api/v1/reports/revenue`
* **Mô tả:** Phục vụ Use Case Xem doanh thu của Parking Manager.

**Dữ liệu truyền vào API (Query Parameters):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `start_date` | String | Ngày bắt đầu thống kê (DD-MM-YYYY) |
| `end_date` | String | Ngày kết thúc thống kê (DD-MM-YYYY) |

**Dữ liệu API trả về:**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `total_revenue` | BigDecimal | Tổng doanh thu trong khoảng thời gian |
| `details` | Array/List | Thống kê phân rã (doanh thu theo ngày, doanh thu theo loại xe) |

---

### 7.2. API get_vehicle_flow_report (Xem báo cáo lượt xe vào/ra)
* **Method:** `GET`
* **URL:** `http://localhost:8080/api/v1/reports/vehicle-flow`

**Dữ liệu truyền vào API (Query Parameters):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `start_date` | String | Ngày bắt đầu thống kê (DD-MM-YYYY) |
| `end_date` | String | Ngày kết thúc thống kê (DD-MM-YYYY) |
| `vehicle_type_id` | int | (Tùy chọn) Lọc theo loại xe |

**Dữ liệu API trả về:**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `total_entries` | int | Tổng số lượt xe vào |
| `total_exits` | int | Tổng số lượt xe ra |
| `details` | Array/List | Thống kê theo ngày hoặc loại xe |

---

### 7.3. API get_occupancy_report (Xem tỷ lệ lấp đầy)
* **Method:** `GET`
* **URL:** `http://localhost:8080/api/v1/reports/occupancy`

**Dữ liệu truyền vào API (Query Parameters):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `start_date` | String | Ngày bắt đầu thống kê (DD-MM-YYYY) |
| `end_date` | String | Ngày kết thúc thống kê (DD-MM-YYYY) |
| `vehicle_type_id` | int | (Tùy chọn) Lọc theo loại xe |

**Dữ liệu API trả về:**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `average_occupancy_rate` | Double | Tỷ lệ lấp đầy trung bình (%) |
| `max_occupancy_rate` | Double | Tỷ lệ lấp đầy cao nhất (%) |
| `details` | Array/List | Thống kê theo ngày hoặc tầng |

---

### 7.4. API get_peak_hour_report (Xem khung giờ cao điểm)
* **Method:** `GET`
* **URL:** `http://localhost:8080/api/v1/reports/peak-hours`

**Dữ liệu truyền vào API (Query Parameters):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `start_date` | String | Ngày bắt đầu thống kê (DD-MM-YYYY) |
| `end_date` | String | Ngày kết thúc thống kê (DD-MM-YYYY) |
| `vehicle_type_id` | int | (Tùy chọn) Lọc theo loại xe |

**Dữ liệu API trả về:**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `peak_hour` | String | Khung giờ đông xe nhất |
| `vehicle_count` | int | Số lượt xe trong khung giờ đó |
| `details` | Array/List | Thống kê lưu lượng theo giờ |

---

### 7.5. API get_dashboard_report (Xem Dashboard tổng quan)
* **Method:** `GET`
* **URL:** `http://localhost:8080/api/v1/reports`

**Dữ liệu truyền vào API (Query Parameters):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `start_date` | String | Ngày bắt đầu thống kê (DD-MM-YYYY) |
| `end_date` | String | Ngày kết thúc thống kê (DD-MM-YYYY) |
| `vehicle_type_id` | int | (Tùy chọn) Lọc theo loại xe |

**Dữ liệu API trả về:**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `total_entries` | int | Tổng lượt xe vào |
| `total_exits` | int | Tổng lượt xe ra |
| `total_revenue` | BigDecimal | Tổng doanh thu |
| `occupancy_rate` | Double | Tỷ lệ lấp đầy (%) |
| `peak_hour` | String | Khung giờ cao điểm |
| `details` | Object | Dữ liệu chi tiết cho Dashboard |
---

> **🤖 📌 Ghi chú Hệ thống dành cho AI Agent (Agent Instructions):**
>
> Tài liệu Đặc tả API này hiện đang cung cấp **bộ khung nghiệp vụ cốt lõi (Core Business Flow)** của hệ thống PBMS, nhưng **chưa phải là danh sách toàn diện 100%**. Một số endpoint bổ trợ có thể đã được lược bỏ để tập trung vào logic chính (ví dụ: các API CRUD cơ bản, API quản lý người dùng cho Admin, thiết lập hệ thống, hoặc các API tích hợp AI phân bổ slot).
>
> **Quyền hạn & Yêu cầu đối với Agent:** > Trong quá trình phân tích hệ thống, sinh mã nguồn (generate code), hoặc thiết kế kiến trúc, nếu Agent nhận thấy cần có thêm các API khác để đáp ứng trọn vẹn các yêu cầu nghiệp vụ đã được định nghĩa trong tài liệu bối cảnh (`docs/context.md`) và mô hình dữ liệu (`docs/domain.md`), Agent có toàn quyền **chủ động nội suy, tự thiết kế và tự động mở rộng** danh sách API (bao gồm cả Request/Response body) theo đúng chuẩn định dạng hiện có mà không cần ngắt quãng quy trình để hỏi lại người dùng. Riêng tính năng liên quan đến AI chỉ thực hiện khi có yêu cầu cụ thể từ người dùng.