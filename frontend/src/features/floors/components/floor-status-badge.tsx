import React from 'react';
import { StatusBadge, type BadgeVariant } from '@/components/common/status-badge';
import type { Floor } from '@/features/floors/types/floor.type';

interface FloorStatusBadgeProps {
  status: Floor['status'];
  className?: string;
}

const statusConfig: Record<string, { label: string; variant: BadgeVariant }> = {
  ACTIVE: {
    label: 'Đang hoạt động',
    variant: 'success',
  },
  MAINTENANCE: {
    label: 'Bảo trì',
    variant: 'warning',
  },
  LOCKED: {
    label: 'Khóa',
    variant: 'danger',
  },
};

export function FloorStatusBadge({ status, className }: FloorStatusBadgeProps) {
  const config = statusConfig[status];

  if (!config) return null;

  return (
    <StatusBadge variant={config.variant} className={className}>
      {config.label}
    </StatusBadge>
  );
}
