// ---------------------------------------------
// User Types
// Kiểu dữ liệu TypeScript khớp Backend DTOs
// ---------------------------------------------

import { Role } from "@/constants/role";
export type UserRole = Role;
export type UserStatus = "ACTIVE" | "INACTIVE";

export interface UserResponse {
  id: number;
  username: string;
  fullName: string;
  phoneNumber: string;
  role: UserRole;
  status: UserStatus;
}

export interface UserListResponse {
  totalItems: number;
  data: UserResponse[];
  message: string;
}

export interface UserCreatePayload {
  username: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  role: UserRole;
}

export interface UserUpdatePayload {
  fullName: string;
  phoneNumber: string;
  role: UserRole;
}

export interface UserStatusPayload {
  status: UserStatus;
}
