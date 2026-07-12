import React from "react";
import { StatusBadge, type BadgeVariant } from "@/components/common/status-badge";
import { FloorStatus, FLOOR_STATUS_LABELS } from "@/constants/floor-status";

interface FloorStatusBadgeProps {
  status: FloorStatus;
  className?: string;
}

const statusVariantMap: Record<FloorStatus, BadgeVariant> = {
  [FloorStatus.ACTIVE]: "success",
  [FloorStatus.MAINTENANCE]: "warning",
  [FloorStatus.LOCKED]: "danger",
};

export function FloorStatusBadge({ status, className }: FloorStatusBadgeProps) {
  return (
    <StatusBadge variant={statusVariantMap[status]} className={className}>
      {FLOOR_STATUS_LABELS[status]}
    </StatusBadge>
  );
}
