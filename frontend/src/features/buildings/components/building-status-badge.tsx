import React from 'react';
import { StatusBadge, type BadgeVariant } from '@/components/common/status-badge';
import type { BuildingResponse } from '@/types/building.type';

interface BuildingStatusBadgeProps {
  status: BuildingResponse['status'];
  className?: string;
}

const statusConfig: Record<BuildingResponse['status'], { label: string; variant: BadgeVariant }> = {
  ACTIVE: {
    label: 'Đang hoạt động',
    variant: 'success',
  },
  MAINTENANCE: {
    label: 'Bảo trì',
    variant: 'warning',
  },
  INACTIVE: {
    label: 'Ngừng hoạt động',
    variant: 'danger',
  },
};

export function BuildingStatusBadge({ status, className }: BuildingStatusBadgeProps) {
  const config = statusConfig[status];

  if (!config) return null;

  return (
    <StatusBadge variant={config.variant} className={className}>
      {config.label}
    </StatusBadge>
  );
}
