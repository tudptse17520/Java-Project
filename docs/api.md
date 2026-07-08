# Tài liệu Đặc tả Hệ thống API - Hệ thống PBMS

Tài liệu này mô tả chi tiết các API endpoints thuộc hệ thống Quản lý Tòa nhà Gửi xe (Parking Building Management System).

* **Base URL:** `http://localhost:8080/api/v1`
* **Mặc định Headers:** `Content-Type: application/json` cho toàn bộ các Request/Response.

---

## 1. Phân hệ Tài khoản & Xác thực (Authentication & Users)

### 1.1. API `create_user` (Tạo tài khoản người dùng)
* **Method:** `POST`
* **URL:** `/users`
* **Mô tả:** Đăng ký tài khoản hệ thống mới (Dành cho Admin hoặc khách tự đăng ký).

**Dữ liệu truyền vào (Request Body):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `username` | String | Tên tài khoản người dùng |
| `password` | String | Mật khẩu đăng nhập |
| `fullName` | String | Họ và tên người dùng |
| `phoneNumber` | String | Số điện thoại liên hệ (Hệ thống tự check Unique) |
| `role` | String | Vai trò (ADMIN, MANAGER, STAFF, USER) |

**Dữ liệu API trả về (Response Body):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `id` | int | Mã định danh người dùng được hệ thống tự động tạo |
| `message` | String | Thông báo trạng thái xử lý |

---

### 1.2. API `login` (Đăng nhập hệ thống)
* **Method:** `POST`
* **URL:** `/auth/login`
* **Mô tả:** Xác thực tài khoản người dùng và cấp mã truy cập.

**Dữ liệu truyền vào (Request Body):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `username` | String | Tên tài khoản đăng nhập |
| `password` | String | Mật khẩu đăng nhập |

**Dữ liệu API trả về (Response Body):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `token` | String | Chuỗi JWT Token dùng để xác thực các request tiếp theo |
| `message` | String | Thông báo trạng thái xử lý |
| `role` | String | Vai trò của người dùng để hệ thống phân quyền giao diện (FE) |

---

### 1.3. API `get_users` (Xem danh sách tài khoản)
* **Method:** `GET`
* **URL:** `/users`
* **Mô tả:** Quản trị viên (Admin) xem và tìm kiếm tài khoản người dùng trong hệ thống.

**Tham số truy vấn (Query Parameters):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `role` | String | *(Tùy chọn)* Lọc theo vai trò (ADMIN, MANAGER, STAFF, USER) |
| `keyword` | String | *(Tùy chọn)* Tìm kiếm theo tên hoặc số điện thoại |

**Dữ liệu API trả về (Response Body):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `total_items` | int | Tổng số lượng tài khoản tìm thấy thỏa mãn điều kiện |
| `data` | Array/List | Mảng chứa danh sách chi tiết các tài khoản (`id`, `username`, `fullName`, `role`...) |
| `message` | String | Thông báo trạng thái |

---

## 2. Phân hệ Cơ sở hạ tầng (Infrastructure Management)

### 2.1. API `create_building` (Thêm tòa nhà / bãi xe mới)
* **Method:** `POST`
* **URL:** `/buildings`
* **Mô tả:** Thêm thông tin bãi xe hoặc tòa nhà mới vào hệ thống quản lý.

**Dữ liệu truyền vào (Request Body):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `building_name` | String | Tên hiển thị của tòa nhà / bãi xe |
| `address` | String | Địa chỉ vật lý của tòa nhà / bãi xe |
| `number_of_floors` | int | Tổng số tầng của tòa nhà |
| `status` | String | Trạng thái hoạt động (ACTIVE, MAINTENANCE, INACTIVE) |

**Dữ liệu API trả về (Response Body):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `id` | int | Mã định danh tòa nhà vừa tạo |
| `message` | String | Thông báo trạng thái |

---

### 2.2. API `create_floor` (Thêm tầng đỗ xe)
* **Method:** `POST`
* **URL:** `/floors`
* **Mô tả:** Thêm thông tin tầng đỗ xe mới thuộc một tòa nhà cụ thể.

**Dữ liệu truyền vào (Request Body):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `building_id` | int | Mã định danh tòa nhà chứa tầng này |
| `vehicle_type_id` | int | Mã định danh loại phương tiện được phép đỗ ở tầng này |
| `floor_name` | String | Tên hiển thị của tầng (VD: Tầng hầm B1) |
| `floor_level` | int | Cấp độ tầng vật lý (VD: -1, 1, 2) |
| `capacity` | int | Sức chứa tổng số xe tối đa của tầng |
| `status` | String | Trạng thái hoạt động ban đầu (ACTIVE, MAINTENANCE, LOCKED) |

**Dữ liệu API trả về (Response Body):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `id` | int | Mã định danh tầng vừa tạo |
| `message` | String | Thông báo trạng thái |

---

### 2.3. API `create_parking_slot` (Thêm vị trí đỗ xe - Slot)
* **Method:** `POST`
* **URL:** `/slots`
* **Mô tả:** Thêm các vị trí ô đỗ xe chi tiết cho từng tầng.

**Dữ liệu truyền vào (Request Body):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `floor_id` | int | Mã định danh tầng chứa vị trí đỗ này |
| `slot_name` | String | Tên/Mã vị trí đỗ (VD: A01, B12) |
| `status` | String | Trạng thái vị trí (AVAILABLE, OCCUPIED, RESERVED, MAINTENANCE, LOCKED) |

**Dữ liệu API trả về (Response Body):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `id` | int | Mã định danh vị trí đỗ vừa tạo |
| `message` | String | Thông báo trạng thái |

---

### 2.4. API `update_slot_status` (Cập nhật trạng thái vị trí đỗ xe)
* **Method:** `PATCH`
* **URL:** `/slots/{id}/status`
* **Mô tả:** Hệ thống tự thay đổi hoặc Staff chủ động cập nhật trạng thái ô đỗ (Ví dụ: Khóa slot để bảo trì).

**Dữ liệu truyền vào (Request Body):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `status` | String | Trạng thái mới muốn cập nhật (AVAILABLE, OCCUPIED, RESERVED, MAINTENANCE, LOCKED) |

**Dữ liệu API trả về (Response Body):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `id` | int | Mã định danh vị trí đỗ vừa cập nhật thành công |
| `status` | String | Trạng thái mới đã ghi nhận |
| `message` | String | Thông báo trạng thái |

---

### 2.5. API `get_buildings_and_floors` (Xem thông tin cấu trúc bãi xe)
* **Method:** `GET`
* **URL:** `/buildings`
* **Mô tả:** Xem danh sách tòa nhà kèm theo toàn bộ thông tin các tầng trực thuộc, phục vụ Parking Manager và giao diện người dùng.

**Tham số truy vấn (Query Parameters):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `status` | String | *(Tùy chọn)* Lọc bãi xe theo trạng thái hoạt động (ACTIVE, MAINTENANCE, INACTIVE) |

**Dữ liệu API trả về (Response Body):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `data` | Array/List | Danh sách chi tiết các tòa nhà, lồng kèm mảng danh sách tầng trực thuộc bên trong |
| `message` | String | Thông báo trạng thái |

---

### 2.6. API `get_slots` (Tra cứu và tìm kiếm ô đỗ trống)
* **Method:** `GET`
* **URL:** `/slots`
* **Mô tả:** Phục vụ chức năng tìm kiếm ô đỗ trống và hiển thị danh sách vị trí đỗ xe lên ứng dụng.

**Tham số truy vấn (Query Parameters):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `floor_id` | int | *(Tùy chọn)* Lọc danh sách ô đỗ thuộc về một tầng cụ thể |
| `status` | String | *(Tùy chọn)* Lọc theo trạng thái (AVAILABLE, OCCUPIED, RESERVED...) |

**Dữ liệu API trả về (Response Body):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `total_available` | int | Tổng số lượng chỗ còn trống hiện tại |
| `data` | Array/List | Mảng danh sách chi tiết cấu trúc các slot (`id`, `slot_name`, `status`) |

---

## 3. Phân hệ Phương tiện & Định giá (Vehicles & Pricing)

### 3.1. API `create_vehicle_type` (Thêm danh mục loại xe)
* **Method:** `POST`
* **URL:** `/vehicle-types`
* **Mô tả:** Thiết lập danh mục các loại phương tiện được phép gửi trong bãi xe.

**Dữ liệu truyền vào (Request Body):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `type_name` | String | Tên danh mục (VD: Ô tô 4 chỗ, Ô tô 7 chỗ, Xe máy số, Xe máy tay ga) |
| `description` | String | Mô tả chi tiết quy định danh mục (nếu có) |
| `status` | String | Trạng thái áp dụng (ACTIVE, INACTIVE) |

**Dữ liệu API trả về (Response Body):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `id` | int | Mã định danh danh mục loại xe vừa tạo |
| `message` | String | Thông báo trạng thái |

---

### 3.2. API `create_pricing_policy` (Thiết lập chính sách giá)
* **Method:** `POST`
* **URL:** `/pricing-policies`
* **Mô tả:** Thiết lập bảng giá, biểu phí áp dụng cho từng loại phương tiện theo các mốc thời gian.

**Dữ liệu truyền vào (Request Body):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `vehicle_type_id` | int | Mã định danh danh mục loại xe áp dụng biểu phí này |
| `base_price` | BigDecimal | Giá cơ bản (Mức phí cố định áp dụng cho block thời gian đầu, ví dụ: 4 tiếng đầu) |
| `extra_fee_per_hour` | BigDecimal | Phí phụ thu tính thêm cho mỗi giờ đỗ xe tiếp theo |
| `effective_date` | String | Ngày chính thức áp dụng bảng giá (Định dạng: DD-MM-YYYY) |

**Dữ liệu API trả về (Response Body):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `id` | int | Mã định danh bảng giá hệ thống vừa lưu |
| `message` | String | Thông báo trạng thái |

---

### 3.3. API `get_pricing_policies` (Xem danh sách cấu hình bảng giá)
* **Method:** `GET`
* **URL:** `/pricing-policies`
* **Mô tả:** Nhân viên gọi để hệ thống tính tiền hoặc Quản lý xem danh sách bảng giá hiện hành.

**Tham số truy vấn (Query Parameters):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `vehicle_type_id` | int | *(Tùy chọn)* Truy vấn riêng bảng giá của một loại xe cụ thể |

**Dữ liệu API trả về (Response Body):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `data` | Array/List | Mảng danh sách các chính sách giá (`base_price`, `extra_fee_per_hour`, `effective_date`) |

---

### 3.4. API `create_vehicle` (Đăng ký xe cá nhân thành viên)
* **Method:** `POST`
* **URL:** `/vehicles`
* **Mô tả:** Khách hàng đăng ký thông tin phương tiện cá nhân lên hệ thống để tiện quản lý và đặt chỗ.

**Dữ liệu truyền vào (Request Body):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `user_id` | int | Mã định danh khách hàng chủ sở hữu xe |
| `vehicle_type_id` | int | Mã định danh danh mục loại xe |
| `plate` | String | Biển số xe đăng ký (Hệ thống tự check Unique) |
| `brand` | String | Hãng sản xuất phương tiện (Honda, Toyota, VinFast...) |
| `color` | String | Màu sắc xe |

**Dữ liệu API trả về (Response Body):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `id` | int | Mã định danh phương tiện vừa tạo |
| `message` | String | Thông báo trạng thái |

---

## 4. Phân hệ Nghiệp vụ đỗ xe cốt lõi (Operations)

### 4.1. API `create_booking` (Đặt chỗ đỗ trước từ xa)
* **Method:** `POST`
* **URL:** `/bookings`
* **Mô tả:** Khách hàng thực hiện đặt và giữ trước vị trí ô đỗ mong muốn từ xa trên Web/App.

**Dữ liệu truyền vào (Request Body):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `user_id` | int | Mã định danh khách hàng thực hiện đặt chỗ |
| `vehicle_id` | int | Mã định danh xe của khách hàng dùng để đi gửi |
| `parking_slot_id` | int | Mã định danh ô đỗ xe muốn giữ vị trí |
| `expected_time_in` | String | Lịch trình thời gian dự kiến vào bãi |
| `expected_time_out` | String | Lịch trình thời gian dự kiến ra bãi |

**Dữ liệu API trả về (Response Body):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `id` | int | Mã định danh đơn đặt chỗ vừa khởi tạo thành công |
| `status` | String | Trạng thái mặc định ban đầu của đơn (PENDING) |
| `message` | String | Thông báo trạng thái |

---

### 4.2. API `get_user_bookings` (Kiểm tra lịch sử đặt chỗ cá nhân)
* **Method:** `GET`
* **URL:** `/users/{user_id}/bookings`
* **Mô tả:** Dành cho người dùng cuối kiểm tra thông tin và trạng thái các đơn đặt giữ chỗ của chính mình.

**Dữ liệu API trả về (Response Body):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `data` | Array/List | Mảng danh sách lịch sử lệnh đặt chỗ (`booking_id`, `parking_slot_id`, `expected_time_in`, `status`) |

---

### 4.3. API `check_in` (Xử lý xe vào bãi - Tạo lượt gửi)
* **Method:** `POST`
* **URL:** `/sessions/check-in`
* **Mô tả:** Khởi tạo một phiên gửi xe mới khi xe di chuyển qua cổng vào bãi đỗ.

**Dữ liệu truyền vào (Request Body):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `plate` | String | Biển số xe quét được hoặc nhập tay tại cổng vào |
| `vehicle_id` | int | Mã phương tiện (*Nullable*, truyền lên nếu nhận diện được xe thành viên hệ thống) |
| `parking_slot_id` | int | Mã vị trí đỗ (*Nullable*, truyền lên nếu xe đi từ luồng đặt giữ chỗ trước) |

**Dữ liệu API trả về (Response Body):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `id` | int | Mã định danh lượt gửi xe vừa được khởi tạo (Parking Session) |
| `ticket_code` | String | Mã vé điện tử duy nhất của lượt gửi (Phục vụ sinh mã QR trên Web App) |
| `time_in` | String | Mốc thời gian xe chính thức qua cổng vào (Timestamp) |
| `status` | String | Trạng thái lượt gửi hiện tại (IN_PROGRESS) |
| `message` | String | Thông báo trạng thái |

---

### 4.4. API `check_out` (Xử lý tính toán phí khi xe ra bãi)
* **Method:** `PUT`
* **URL:** `/sessions/{session_id}/check-out`
* **Mô tả:** Ghi nhận mốc thời gian ra bãi và tự động tính toán tổng số tiền phí cần thanh toán dựa trên biểu phí quy định.

**Dữ liệu truyền vào (Request Body):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `time_out` | String | Mốc thời gian xe thực tế chuẩn bị ra bãi (Timestamp) |

**Dữ liệu API trả về (Response Body):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `session_id` | int | Mã định danh lượt gửi xe |
| `time_in` | String | Thời gian xe vào bãi |
| `time_out` | String | Thời gian xe ra bãi |
| `total_fee` | BigDecimal | Tổng số tiền phí cần thanh toán (Hệ thống tự động tính toán dựa vào biểu phí tương ứng) |
| `status` | String | Trạng thái lượt gửi xe cập nhật (COMPLETED) |

---

### 4.5. API `get_parking_sessions` (Theo dõi và tra cứu danh sách lượt gửi)
* **Method:** `GET`
* **URL:** `/sessions`
* **Mô tả:** Nhân viên bãi xe tra cứu thông tin xe lúc ra, Quản lý dùng để giám sát các xe quá giờ đỗ quy định.

**Tham số truy vấn (Query Parameters):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `plate` | String | *(Tùy chọn)* Tìm kiếm chính xác lịch sử theo biển số xe |
| `status` | String | *(Tùy chọn)* Trạng thái lượt gửi (`IN_PROGRESS`: đang ở trong bãi, `COMPLETED`: xe đã ra ngoài) |
| `from_date` | String | *(Tùy chọn)* Lọc danh sách xe bắt đầu vào bãi từ mốc ngày... |

**Dữ liệu API trả về (Response Body):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `total_items` | int | Số lượng lượt gửi tìm thấy thỏa mãn bộ lọc |
| `data` | Array/List | Danh sách chi tiết các lượt gửi (`id`, `plate`, `time_in`, `time_out`, `total_fee`) |

---

## 5. Phân hệ Giao dịch & Sự cố (Billing & Feedbacks)

### 5.1. API `create_payment` (Tạo biên lai thanh toán giao dịch)
* **Method:** `POST`
* **URL:** `/payments`
* **Mô tả:** Ghi nhận giao dịch thanh toán chi phí đỗ xe hoặc tiền đặt cọc giữ chỗ của khách hàng.

**Dữ liệu truyền vào (Request Body):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `parking_session_id` | int | Mã định danh lượt gửi xe thanh toán khi ra bãi (*Nullable*) |
| `booking_id` | int | Mã định danh đơn đặt chỗ dùng để thanh toán tiền cọc giữ chỗ từ xa trên Web (*Nullable*) |
| `amount` | BigDecimal | Số tiền thực hiện thanh toán |
| `payment_method` | String | Hình thức thực hiện giao dịch (Cash, Momo, Vnpay, Credit_Card) |
| `fee_type` | String | Loại chi phí (Parking_Fee, Booking_Deposit, Lost_Ticket_Fine) |

**Dữ liệu API trả về (Response Body):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `id` | int | Mã định danh hóa đơn/biên lai giao dịch vừa tạo |
| `payment_time` | String | Thời gian hoàn tất xử lý giao dịch tài chính |
| `status` | String | Trạng thái giao dịch hệ thống (PENDING, SUCCESS, FAILED) |

---

### 5.2. API `create_feedback` (Ghi nhận biên bản báo cáo sự cố ngoại lệ)
* **Method:** `POST`
* **URL:** `/feedbacks`
* **Mô tả:** Ghi nhận và phản hồi các sự cố vận hành phát sinh trong bãi xe (Mất thẻ, sai biển số, đỗ sai vị trí...).

**Dữ liệu truyền vào (Request Body):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `parking_session_id` | int | Mã định danh lượt gửi xe đang phát sinh vấn đề |
| `issue_type` | String | Phân loại sự cố (LOST_TICKET, WRONG_PLATE, OVERTIME, WRONG_PLACE, UNPAID_EXIT) |
| `description` | String | Nội dung mô tả chi tiết diễn biến sự việc |
| `status` | String | Trạng thái xử lý lỗi (REPORTED, PROCESSING, RESOLVED) |

**Dữ liệu API trả về (Response Body):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `id` | int | Mã định danh phiếu ghi nhận báo cáo sự cố |
| `message` | String | Thông báo trạng thái hệ thống |

---

### 5.3. API `get_feedbacks` (Xem danh sách sự cố / Ngoại lệ vận hành)
* **Method:** `GET`
* **URL:** `/feedbacks`
* **Mô tả:** Parking Manager theo dõi và quản lý danh sách các biên bản ngoại lệ vận hành trong toàn hệ thống bãi xe.

**Tham số truy vấn (Query Parameters):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `issue_type` | String | *(Tùy chọn)* Lọc danh sách theo tính chất lỗi (LOST_TICKET, OVERTIME...) |
| `status` | String | *(Tùy chọn)* Lọc theo trạng thái xử lý biên bản (REPORTED, PROCESSING, RESOLVED) |

**Dữ liệu API trả về (Response Body):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `data` | Array/List | Danh sách báo cáo sự cố chi tiết lồng thông tin `parking_session_id` liên đới |

---

## 6. Phân hệ Nghiệp vụ nâng cao & Xử lý ngoại lệ (Advanced Operations)

### 6.1. API `resolve_lost_ticket` (Xử lý mất vé)
* **Method:** `POST`
* **URL:** `/sessions/{session_id}/lost-ticket`
* **Mô tả:** Nhân viên trực bốt bãi xe tiến hành xác minh thông tin giấy tờ xe và áp dụng hình thức phạt mất thẻ/vé đối với khách hàng.

**Tham số truyền vào (Path & Body Parameters):**

| Tham số | Kiểu dữ liệu | Vị trí | Ý nghĩa |
| :--- | :--- | :--- | :--- |
| `session_id` | int | Path | Mã định danh lượt gửi xe |
| `staff_id` | int | Body | Mã định danh nhân viên trực bốt xử lý |
| `note` | String | Body | Ghi chú xác minh giấy tờ xe (Bắt buộc) |

**Dữ liệu API trả về (Response Body):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `base_fee` | BigDecimal | Phí gửi xe gốc tính theo thời gian đỗ |
| `penalty_fee` | BigDecimal | Phí phạt mất thẻ bãi xe theo quy định |
| `total_fee` | BigDecimal | Tổng số tiền khách hàng cần thực hiện thanh toán |
| `message` | String | Thông báo trạng thái |

---

### 6.2. API `check_out_validation` (Xử lý ra bãi - Phát hiện sai biển số)
* **Method:** `POST`
* **URL:** `/sessions/{session_id}/validate-plate`
* **Mô tả:** Kiểm tra và đối chiếu tự động biển số xe quét được lúc ra cổng so với biển số lúc vào bãi nhằm bảo mật tài sản. Trả về mã lỗi HTTP 409 Conflict khi phát hiện sai lệch.

**Tham số truyền vào (Path & Body Parameters):**

| Tham số | Kiểu dữ liệu | Vị trí | Ý nghĩa |
| :--- | :--- | :--- | :--- |
| `session_id` | int | Path | Mã định danh lượt gửi xe |
| `plate_out` | String | Body | Biển số xe hệ thống quét được lúc ra cổng |
| `plate_out_image` | String | Body | Đường dẫn lưu trữ hình ảnh biển số lúc ra để đối chiếu |

**Dữ liệu API trả về (Response Body):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `error_code` | String | Mã lỗi trả về hệ thống (`LICENSE_PLATE_MISMATCH`) |
| `message` | String | Cảnh báo chi tiết về việc sai lệch biển số phương tiện, thực hiện chặn mở cổng |

---

### 6.3. API `override_checkout` (Xử lý sai biển số - Bỏ qua lỗi)
* **Method:** `POST`
* **URL:** `/sessions/{session_id}/override-checkout`
* **Mô tả:** Cho phép nhân viên trực bốt ghi nhận lý do đặc biệt để cưỡng chế đóng phiên gửi xe và mở cổng ra cho phương tiện khi hệ thống cảnh báo sai biển số nhưng nhân viên đã đối soát thủ công an toàn.

**Tham số truyền vào (Path & Body Parameters):**

| Tham số | Kiểu dữ liệu | Vị trí | Ý nghĩa |
| :--- | :--- | :--- | :--- |
| `session_id` | int | Path | Mã định danh lượt gửi xe |
| `staff_id` | int | Body | Mã định danh nhân viên trực tiếp xác nhận cho qua |
| `override_reason` | String | Body | Nội dung lý do bỏ qua lỗi hệ thống (Ví dụ: "Đã đối chiếu giấy tờ xe chính chủ") |

**Dữ liệu API trả về (Response Body):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `session_id` | int | Mã định danh lượt gửi xe vừa được xử lý thành công |
| `status` | String | Trạng thái cập nhật của phiên gửi (`COMPLETED`) |
| `message` | String | Thông báo đóng phiên gửi xe thành công, lệnh mở barrier cổng ra |

---

### 6.4. API `calculate_fee` (Xử lý đỗ quá giờ - Tính cước trước khi ra)
* **Method:** `POST`
* **URL:** `/sessions/{session_id}/calculate-fee`
* **Mô tả:** Cho phép truy vấn tính toán trước toàn bộ các chi phí phát sinh bao gồm cước cơ bản và phụ thu đỗ quá giờ trước khi xe thực tế di chuyển ra cổng bốt.

**Tham số truyền vào (Path Parameters):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `session_id` | int | *(Path Parameter)* Mã định danh lượt gửi xe cần tính cước |

**Dữ liệu API trả về (Response Body):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `base_fee` | BigDecimal | Số tiền phí cơ bản theo gói/vé ban đầu hệ thống cấu hình |
| `overtime_fee` | BigDecimal | Số tiền phụ thu tính thêm do đỗ quá block thời gian quy định (Nếu có) |
| `total_fee` | BigDecimal | Tổng cộng tiền cước cuối cùng cần phải thực hiện thanh toán |
| `message` | String | Thông báo trạng thái |

---

### 6.5. API `create_violation` (Xử lý đỗ sai vị trí)
* **Method:** `POST`
* **URL:** `/violations`
* **Mô tả:** Nhân viên quản trị bãi xe lập biên bản xử phạt hành chính đối với các trường hợp phương tiện cố tình đỗ sai phân khu/tầng quy định.

**Dữ liệu truyền vào (Request Body):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `session_id` | int | Mã định danh lượt gửi xe vi phạm quy chế |
| `expected_floor_id` | int | Mã định danh tầng được cấp phép đỗ xe ban đầu của hệ thống |
| `actual_floor_id` | int | Mã định danh tầng thực tế mà xe đang đỗ sai quy định |
| `evidence_image` | String | Đường dẫn hình ảnh bằng chứng đỗ sai vị trí do nhân viên trực bãi chụp lại |

**Dữ liệu API trả về (Response Body):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `id` | int | Mã định danh biên bản vi phạm vừa được khởi tạo trên hệ thống |
| `message` | String | Thông báo trạng thái ghi nhận thông tin vi phạm thành công |

---

### 6.6. API `check_exit_gate` (Xử lý xe ra chưa thanh toán)
* **Method:** `POST`
* **URL:** `/sessions/{session_id}/exit-gate`
* **Mô tả:** Hệ thống kiểm tra điều kiện mở cổng barrier ra. Trả về mã HTTP 402 Payment Required nếu phát hiện tài khoản lượt gửi vẫn chưa hoàn tất thanh toán các khoản dư nợ phí đỗ.

**Tham số truyền vào (Path Parameters):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `session_id` | int | Mã định danh lượt gửi xe đang yêu cầu kiểm tra điều kiện mở cổng ra |

**Dữ liệu API trả về (Response Body):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `error_code` | String | Mã lỗi trả về (`UNPAID_EXIT`) |
| `message` | String | Thông báo yêu cầu khách hàng thực hiện thanh toán toàn bộ dư nợ trước khi barrier mở cổng |

---

## 7. Phân hệ Thống kê & Báo cáo (Reports & Analytics)

### 7.1. API `get_revenue_report` (Thống kê và đối soát doanh thu)
* **Method:** `GET`
* **URL:** `/reports/revenue`
* **Mô tả:** Hỗ trợ Parking Manager thống kê, phân rã doanh thu bãi gửi xe theo thời gian và loại phương tiện gửi.

**Tham số truy vấn (Query Parameters):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `start_date` | String | Ngày bắt đầu khoảng thời gian thống kê (Định dạng: DD-MM-YYYY) |
| `end_date` | String | Ngày kết thúc khoảng thời gian thống kê (Định dạng: DD-MM-YYYY) |

**Dữ liệu API trả về (Response Body):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `total_revenue` | BigDecimal | Tổng doanh thu gộp nhận được trong khoảng thời gian chỉ định |
| `details` | Array/List | Thống kê phân rã chi tiết (Mảng doanh thu lũy kế theo từng ngày, doanh thu phân hóa theo từng loại phương tiện) |

---

### 7.2. API `get_vehicle_flow_report` (Xem báo cáo lượt xe vào/ra)
* **Method:** `GET`
* **URL:** `/reports/vehicle-flow`
* **Mô tả:** Thống kê lưu lượng và số lượt phương tiện di chuyển vào bãi và ra khỏi bãi xe theo bộ lọc.

**Tham số truy vấn (Query Parameters):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `start_date` | String | Ngày bắt đầu khoảng thời gian thống kê lưu lượng (Định dạng: DD-MM-YYYY) |
| `end_date` | String | Ngày kết thúc khoảng thời gian thống kê lưu lượng (Định dạng: DD-MM-YYYY) |
| `vehicle_type_id` | int | *(Tùy chọn)* Lọc dữ liệu thống kê theo một loại xe cụ thể |

**Dữ liệu API trả về (Response Body):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `total_entries` | int | Tổng số lượt xe đã thực hiện di chuyển vào bãi |
| `total_exits` | int | Tổng số lượt xe đã thực hiện di chuyển ra bãi |
| `details` | Array/List | Thống kê chi tiết số lượt phương tiện theo từng ngày hoặc loại xe |

---

### 7.3. API `get_occupancy_report` (Xem tỷ lệ lấp đầy)
* **Method:** `GET`
* **URL:** `/reports/occupancy`
* **Mô tả:** Thống kê tỷ lệ sử dụng, lấp đầy trung bình và cao điểm của các vị trí đỗ xe trong bãi.

**Tham số truy vấn (Query Parameters):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `start_date` | String | Ngày bắt đầu khoảng thời gian thống kê (Định dạng: DD-MM-YYYY) |
| `end_date` | String | Ngày kết thúc khoảng thời gian thống kê (Định dạng: DD-MM-YYYY) |
| `vehicle_type_id` | int | *(Tùy chọn)* Lọc tỷ lệ lấp đầy theo phân loại xe riêng biệt |

**Dữ liệu API trả về (Response Body):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `average_occupancy_rate` | Double | Tỷ lệ lấp đầy trung bình của bãi xe (%) |
| `max_occupancy_rate` | Double | Tỷ lệ lấp đầy cao nhất ghi nhận được (%) |
| `details` | Array/List | Thống kê phân rã tỷ lệ lấp đầy cụ thể theo ngày hoặc theo từng tầng đỗ |

---

### 7.4. API `get_peak_hour_report` (Xem khung giờ cao điểm)
* **Method:** `GET`
* **URL:** `/reports/peak-hours`
* **Mô tả:** Phân tích dữ liệu bãi xe nhằm chỉ ra khung giờ có tần suất phương tiện ra vào bãi đông nhất phục vụ điều phối nhân sự.

**Tham số truy vấn (Query Parameters):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `start_date` | String | Ngày bắt đầu khoảng thời gian phân tích (Định dạng: DD-MM-YYYY) |
| `end_date` | String | Ngày kết thúc khoảng thời gian phân tích (Định dạng: DD-MM-YYYY) |
| `vehicle_type_id` | int | *(Tùy chọn)* Phân tích khung giờ cao điểm của riêng một loại phương tiện |

**Dữ liệu API trả về (Response Body):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `peak_hour` | String | Khung giờ ghi nhận số lượng xe đông nhất trong bãi |
| `vehicle_count` | int | Tổng số lượng lượt xe ghi nhận được trong khung giờ cao điểm đó |
| `details` | Array/List | Bảng thống kê lưu lượng phương tiện chi tiết phân rã theo toàn bộ các giờ trong ngày |

---

### 7.5. API `get_dashboard_report` (Xem Dashboard tổng quan)
* **Method:** `GET`
* **URL:** `/reports`
* **Mô tả:** Cung cấp toàn bộ các chỉ số cốt lõi tổng quan nhất để kết xuất dữ liệu lên màn hình Dashboard quản trị chính.

**Tham số truy vấn (Query Parameters):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `start_date` | String | Ngày bắt đầu thống kê dữ liệu Dashboard (Định dạng: DD-MM-YYYY) |
| `end_date` | String | Ngày kết thúc thống kê dữ liệu Dashboard (Định dạng: DD-MM-YYYY) |
| `vehicle_type_id` | int | *(Tùy chọn)* Lọc chỉ số Dashboard theo loại phương tiện |

**Dữ liệu API trả về (Response Body):**

| Tham số | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `total_entries` | int | Tổng số lượt phương tiện vào bãi |
| `total_exits` | int | Tổng số lượt phương tiện ra bãi |
| `total_revenue` | BigDecimal | Tổng doanh thu tài chính gộp thu được |
| `occupancy_rate` | Double | Tỷ lệ lấp đầy bãi xe hiện hành (%) |
| `peak_hour` | String | Khung giờ cao điểm bận rộn nhất |
| `details` | Object | Đối tượng chứa tập hợp dữ liệu chi tiết cấu thành nên các biểu đồ Dashboard |