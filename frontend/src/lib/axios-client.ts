// ---------------------------------------------
// Axios Client
// Instance Axios cấu hình gắn Token tự động và xử lý lỗi
// ---------------------------------------------

import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import type { ApiErrorResponse } from "@/types/api";

// Sử dụng biến môi trường trực tiếp để tránh lỗi khi env.ts validate fail
const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

/**
 * Axios instance chính cho toàn bộ ứng dụng
 */
const axiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// =============================================
// REQUEST INTERCEPTOR
// Gắn JWT token từ cookie vào header Authorization
// =============================================
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Chỉ chạy phía client
    if (typeof window !== "undefined") {
      const match = document.cookie.match(
        /(^| )access_token=([^;]+)/
      );
      const token = match ? match[2] : null;

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// =============================================
// RESPONSE INTERCEPTOR
// Xử lý lỗi tập trung: 401 (redirect login), 403, 500
// =============================================
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError<ApiErrorResponse>) => {
    const status = error.response?.status;

    switch (status) {
      case 401:
        // Token hết hạn hoặc không hợp lệ -> redirect login
        if (typeof window !== "undefined") {
          // Xóa token cũ
          document.cookie =
            "access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
          window.location.href = "/login";
        }
        break;

      case 403:
        // Không có quyền truy cập
        if (typeof window !== "undefined") {
          window.location.href = "/forbidden";
        }
        break;

      case 500:
        // Lỗi server
        console.error("Server Error:", error.response?.data?.message);
        break;

      default:
        break;
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
