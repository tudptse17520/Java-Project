import React from 'react';
import { StatusBadge, type BadgeVariant } from '@/components/common/status-badge';

interface SessionStatusBadgeProps {
  timeOut?: string | null;
  className?: string;
}

export function SessionStatusBadge({ timeOut, className }: SessionStatusBadgeProps) {
  const isCompleted = !!timeOut;
  
  const variant: BadgeVariant = isCompleted ? 'success' : 'warning';
  const label = isCompleted ? 'Đã ra bãi' : 'Đang trong bãi';

  return (
    <StatusBadge variant={variant} className={className}>
      {label}
    </StatusBadge>
  );
}
