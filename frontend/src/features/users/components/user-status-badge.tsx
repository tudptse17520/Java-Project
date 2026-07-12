import { StatusBadge } from "@/components/common/status-badge";
import { UserStatus } from "@/types/user.type";

interface UserStatusBadgeProps {
  status: UserStatus;
}

export function UserStatusBadge({ status }: UserStatusBadgeProps) {
  const variant = status === "ACTIVE" ? "success" : "danger";
  const label = status === "ACTIVE" ? "Hoạt động" : "Bị khóa";

  return <StatusBadge variant={variant}>{label}</StatusBadge>;
}
