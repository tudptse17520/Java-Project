import { StatusBadge } from "@/components/common/status-badge";
import { UserRole } from "@/types/user.type";
import { ROLE_LABELS } from "@/constants/role";

interface UserRoleBadgeProps {
  role: UserRole;
}

export function UserRoleBadge({ role }: UserRoleBadgeProps) {
  const variant =
    role === "ADMIN"
      ? "purple"
      : role === "MANAGER"
      ? "warning"
      : role === "STAFF"
      ? "info"
      : "cyan";

  // Hide icon for roles to make it cleaner, or keep it. The user said "keep same height/padding/border-radius". 
  // We'll pass icon={null} if we don't want an icon, but we can keep the icon for consistency.
  return <StatusBadge variant={variant} icon={null}>{ROLE_LABELS[role]}</StatusBadge>;
}
