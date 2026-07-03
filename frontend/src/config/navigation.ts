// ---------------------------------------------
// Navigation Configuration
// Định nghĩa mảng Menu tĩnh cho Sidebar
// ---------------------------------------------

import {
  LayoutDashboard,
  Users,
  Settings,
  Building2,
  Layers,
  ParkingSquare,
  DollarSign,
  MessageSquareWarning,
  BarChart3,
  LogIn,
  LogOut,
  ClipboardList,
  CreditCard,
  Search,
  CalendarCheck,
  Car,
  UserCircle,
  type LucideIcon,
} from "lucide-react";
import { Role } from "@/constants/role";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  roles: Role[];
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const ADMIN_NAV: NavGroup[] = [
  {
    label: "Tổng quan",
    items: [
      {
        title: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
        roles: [Role.ADMIN],
      },
    ],
  },
  {
    label: "Quản lý",
    items: [
      {
        title: "Tài khoản",
        href: "/admin/users",
        icon: Users,
        roles: [Role.ADMIN],
      },
      {
        title: "Cấu hình",
        href: "/admin/settings",
        icon: Settings,
        roles: [Role.ADMIN],
      },
    ],
  },
];

export const MANAGER_NAV: NavGroup[] = [
  {
    label: "Tổng quan",
    items: [
      {
        title: "Dashboard",
        href: "/manager/dashboard",
        icon: LayoutDashboard,
        roles: [Role.MANAGER],
      },
    ],
  },
  {
    label: "Quản lý vận hành",
    items: [
      {
        title: "Tòa nhà",
        href: "/manager/buildings",
        icon: Building2,
        roles: [Role.MANAGER],
      },
      {
        title: "Tầng đỗ",
        href: "/manager/floors",
        icon: Layers,
        roles: [Role.MANAGER],
      },
      {
        title: "Vị trí đỗ",
        href: "/manager/slots",
        icon: ParkingSquare,
        roles: [Role.MANAGER],
      },
      {
        title: "Chính sách giá",
        href: "/manager/pricing",
        icon: DollarSign,
        roles: [Role.MANAGER],
      },
    ],
  },
  {
    label: "Giám sát",
    items: [
      {
        title: "Sự cố",
        href: "/manager/feedbacks",
        icon: MessageSquareWarning,
        roles: [Role.MANAGER],
      },
      {
        title: "Báo cáo",
        href: "/manager/reports",
        icon: BarChart3,
        roles: [Role.MANAGER],
      },
    ],
  },
];

export const STAFF_NAV: NavGroup[] = [
  {
    label: "Tổng quan",
    items: [
      {
        title: "Dashboard",
        href: "/staff/dashboard",
        icon: LayoutDashboard,
        roles: [Role.STAFF],
      },
    ],
  },
  {
    label: "Vận hành",
    items: [
      {
        title: "Check-in",
        href: "/staff/check-in",
        icon: LogIn,
        roles: [Role.STAFF],
      },
      {
        title: "Check-out",
        href: "/staff/check-out",
        icon: LogOut,
        roles: [Role.STAFF],
      },
      {
        title: "Lượt gửi xe",
        href: "/staff/sessions",
        icon: ClipboardList,
        roles: [Role.STAFF],
      },
      {
        title: "Thanh toán",
        href: "/staff/payments",
        icon: CreditCard,
        roles: [Role.STAFF],
      },
    ],
  },
];

export const DRIVER_NAV: NavItem[] = [
  {
    title: "Tìm slot",
    href: "/browse",
    icon: Search,
    roles: [Role.USER],
  },
  {
    title: "Đặt chỗ",
    href: "/reservations",
    icon: CalendarCheck,
    roles: [Role.USER],
  },
  {
    title: "Phương tiện",
    href: "/vehicles",
    icon: Car,
    roles: [Role.USER],
  },
  {
    title: "Hồ sơ",
    href: "/profile",
    icon: UserCircle,
    roles: [Role.USER],
  },
];
