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
        return 'default';
      case 'OVERDUE':
        return 'danger';
      case 'PENDING_PAYMENT':
        return 'warning';
      default:
        return 'info';
    }
  };

  const getLabel = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return 'Đang gửi';
      case 'COMPLETED':
        return 'Đã ra';
      case 'OVERDUE':
        return 'Quá hạn';
      case 'PENDING_PAYMENT':
        return 'Chờ thanh toán';
      default:
        return status;
    }
  };

  return <StatusBadge variant={getVariant(status)}>{getLabel(status)}</StatusBadge>;
};
