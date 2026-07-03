// ---------------------------------------------
// Menu Configuration
// Cấu hình hiển thị menu theo quyền hạn
// ---------------------------------------------

import { Role } from "@/constants/role";
import {
  ADMIN_NAV,
  MANAGER_NAV,
  STAFF_NAV,
  DRIVER_NAV,
  type NavGroup,
  type NavItem,
} from "@/config/navigation";

/**
 * Lấy navigation groups theo role cho sidebar (dashboard)
 */
export function getNavGroupsByRole(role: Role): NavGroup[] {
  switch (role) {
    case Role.ADMIN:
      return ADMIN_NAV;
    case Role.MANAGER:
      return MANAGER_NAV;
    case Role.STAFF:
      return STAFF_NAV;
    default:
      return [];
  }
}

/**
 * Lấy navigation items theo role cho driver top navbar
 */
export function getDriverNavItems(): NavItem[] {
  return DRIVER_NAV;
}

/**
 * Lấy đường dẫn dashboard mặc định theo role
 */
export function getDefaultDashboardPath(role: Role): string {
  switch (role) {
    case Role.ADMIN:
      return "/admin/dashboard";
    case Role.MANAGER:
      return "/manager/dashboard";
    case Role.STAFF:
      return "/staff/dashboard";
    case Role.USER:
      return "/browse";
    default:
      return "/login";
  }
}
