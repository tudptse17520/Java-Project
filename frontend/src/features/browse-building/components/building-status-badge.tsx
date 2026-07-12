import React from "react";
import { StatusBadge, type BadgeVariant } from "@/components/common/status-badge";
import { BuildingStatus, BUILDING_STATUS_LABELS } from "@/constants/building-status";

interface BuildingStatusBadgeProps {
  status: BuildingStatus;
  className?: string;
}

const statusVariantMap: Record<BuildingStatus, BadgeVariant> = {
  [BuildingStatus.ACTIVE]: "success",
  [BuildingStatus.MAINTENANCE]: "warning",
  [BuildingStatus.INACTIVE]: "danger",
};

export function BuildingStatusBadge({ status, className }: BuildingStatusBadgeProps) {
  return (
    <StatusBadge variant={statusVariantMap[status]} className={className}>
      {BUILDING_STATUS_LABELS[status]}
    </StatusBadge>
  );
}
