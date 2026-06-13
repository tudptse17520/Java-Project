# Parking Building Management System (PBMS)

PBMS là một ứng dụng web hỗ trợ vận hành bãi xe nhiều tầng. Hệ thống giúp tối ưu hóa việc sử dụng không gian đỗ xe thông qua quản lý lượt xe vào/ra (check-in/check-out), trạng thái slot, lượt gửi xe (parking session), chính sách tính phí, đặt chỗ trước và các báo cáo doanh thu, vận hành bãi xe.

## System Components

* **Backend API:** Spring Boot REST API, Layered Architecture
* **Web Application:** React / Next.js
* **Database:** Microsoft SQL Server
* **Documentation:** Swagger UI (OpenAPI)

## Project Structure

```text
PBMS/
├── backend/            # Spring Boot REST API
├── frontend/           # React / Next.js Web Application
└── README.md
```

## Technology Stack

### Backend

* Java 21
* Spring Boot 3.x
* Maven
* Spring Data JPA
* Lombok
* SpringDoc OpenAPI (Swagger)

### Frontend

* React / Next.js
* JavaScript / TypeScript

### Database

* Microsoft SQL Server

## System Architecture

```text
+----------------------+
|   React / Next.js    |
|      Frontend        |
+----------+-----------+
           |
           | REST API
           v
+----------------------+
|     Spring Boot      |
|       Backend        |
+----------+-----------+
           |
           | JPA
           v
+----------------------+
| Microsoft SQL Server |
|      Database        |
+----------------------+
```
