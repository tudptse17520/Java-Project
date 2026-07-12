@echo off
title PBMS Project Control Panel
color 0A
cls
echo ==============================================================================
echo              PARKING BUILDING MANAGEMENT SYSTEM (PBMS) CONTROL PANEL
echo ==============================================================================
echo.
echo  He thong dang khoi dong hai ung dung trong cac cua so rieng biet...
echo.
echo  [1/2] Khoi dong Spring Boot Backend tai cong 8080...
start "PBMS Backend Server" cmd /k "cd backend && mvn spring-boot:run"

echo  [2/2] Khoi dong Next.js Frontend tai cong 3000...
start "PBMS Frontend Client" cmd /k "cd frontend && npm run dev"

echo.
echo ==============================================================================
echo  KHOI DONG THANH CONG!
echo.
echo  - Frontend URL: http://localhost:3000
echo  - Backend URL:  http://localhost:8080
echo  - Swagger API:  http://localhost:8080/swagger-ui/index.html
echo.
echo  De tat cac server, vui long dong cac cua so command line phu tuong ung.
echo ==============================================================================
echo.
pause
