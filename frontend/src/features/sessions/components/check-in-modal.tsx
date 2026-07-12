import React from 'react';
import { CheckInForm } from './check-in-form';

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckInModal = ({ isOpen, onClose }: CheckInModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background w-full max-w-lg rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Check-in xe vào bãi</h2>
          <p className="text-sm text-muted-foreground">Nhập thông tin phương tiện để check-in</p>
        </div>
        <div className="p-4">
          <CheckInForm onSuccess={onClose} onCancel={onClose} />
        </div>
      </div>
    </div>
  );
};
