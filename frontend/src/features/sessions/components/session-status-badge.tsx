import React from 'react';
import { StatusBadge, BadgeVariant } from '@/components/common/status-badge';

interface SessionStatusBadgeProps {
  status: 'IN_PROGRESS' | 'COMPLETED';
}

export const SessionStatusBadge = ({ status }: SessionStatusBadgeProps) => {
  const getVariant = (status: string): BadgeVariant => {
    switch (status) {
      case 'IN_PROGRESS':
        return 'success';
      case 'COMPLETED':
        return 'info';
      default:
        return 'info';
    }
  };

  const getLabel = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return 'Đang đỗ';
      case 'COMPLETED':
        return 'Đã ra';
      default:
        return status;
    }
  };

  return <StatusBadge variant={getVariant(status)}>{getLabel(status)}</StatusBadge>;
};
