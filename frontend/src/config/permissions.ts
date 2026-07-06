// ---------------------------------------------
// Permissions Configuration
// Định nghĩa danh sách chức năng tương ứng với từng vai trò
// ---------------------------------------------

import { Role } from "@/constants/role";

export const PERMISSIONS = {
  // Admin permissions
  MANAGE_USERS: "manage_users",
  MANAGE_SETTINGS: "manage_settings",
  VIEW_ADMIN_DASHBOARD: "view_admin_dashboard",

  // Manager permissions
  MANAGE_BUILDINGS: "manage_buildings",
  MANAGE_FLOORS: "manage_floors",
  MANAGE_SLOTS: "manage_slots",
  MANAGE_PRICING: "manage_pricing",
  MANAGE_FEEDBACKS: "manage_feedbacks",
  VIEW_REPORTS: "view_reports",
  VIEW_MANAGER_DASHBOARD: "view_manager_dashboard",

  // Staff permissions
  PROCESS_CHECK_IN: "process_check_in",
  PROCESS_CHECK_OUT: "process_check_out",
  VIEW_SESSIONS: "view_sessions",
  PROCESS_PAYMENTS: "process_payments",
  VIEW_STAFF_DASHBOARD: "view_staff_dashboard",

  // User/Driver permissions
  BROWSE_SLOTS: "browse_slots",
  MANAGE_RESERVATIONS: "manage_reservations",
  MANAGE_VEHICLES: "manage_vehicles",
  VIEW_PROFILE: "view_profile",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

/**
 * Mapping vai trò -> danh sách quyền
 */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.ADMIN]: [
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_SETTINGS,
    PERMISSIONS.VIEW_ADMIN_DASHBOARD,
  ],
  [Role.MANAGER]: [
    PERMISSIONS.MANAGE_BUILDINGS,
    PERMISSIONS.MANAGE_FLOORS,
    PERMISSIONS.MANAGE_SLOTS,
    PERMISSIONS.MANAGE_PRICING,
    PERMISSIONS.MANAGE_FEEDBACKS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.VIEW_MANAGER_DASHBOARD,
  ],
  [Role.STAFF]: [
    PERMISSIONS.PROCESS_CHECK_IN,
    PERMISSIONS.PROCESS_CHECK_OUT,
    PERMISSIONS.VIEW_SESSIONS,
    PERMISSIONS.PROCESS_PAYMENTS,
    PERMISSIONS.VIEW_STAFF_DASHBOARD,
  ],
  [Role.USER]: [
    PERMISSIONS.BROWSE_SLOTS,
    PERMISSIONS.MANAGE_RESERVATIONS,
    PERMISSIONS.MANAGE_VEHICLES,
    PERMISSIONS.VIEW_PROFILE,
  ],
};
