// ---------------------------------------------
// Role Constants
// Vai trò tài khoản trong hệ thống PBMS
// ---------------------------------------------

export enum Role {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  STAFF = "STAFF",
  USER = "USER",
}

export const ROLE_LABELS: Record<Role, string> = {
  [Role.ADMIN]: "Quản trị viên",
  [Role.MANAGER]: "Quản lý bãi xe",
  [Role.STAFF]: "Nhân viên",
  [Role.USER]: "Khách hàng",
};
