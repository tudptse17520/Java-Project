import { StatusBadge } from "@/components/common/status-badge";
import { UserRole } from "@/types/user.type";
import { ROLE_LABELS } from "@/constants/role";

interface UserRoleBadgeProps {
  role: UserRole;
}

export function UserRoleBadge({ role }: UserRoleBadgeProps) {
  const variant =
    role === "ADMIN"
      ? "success"
      : role === "MANAGER"
      ? "warning"
      : "info";

  return <StatusBadge variant={variant}>{ROLE_LABELS[role]}</StatusBadge>;
}
