import React from 'react';
import { CheckInForm } from './check-in-form';
import { Portal } from '@/components/common/portal';

import { CheckInFormValues } from '../schemas/check-in-form.schema';

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultValues?: Partial<CheckInFormValues>;
}

export const CheckInModal = ({ isOpen, onClose, defaultValues }: CheckInModalProps) => {
  if (!isOpen) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
        <div className="bg-background w-full max-w-lg rounded-lg shadow-lg overflow-hidden relative">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Check-in xe vào bãi</h2>
            <p className="text-sm text-muted-foreground">Nhập thông tin phương tiện để check-in</p>
          </div>
          <div className="p-4">
            <CheckInForm onSuccess={onClose} onCancel={onClose} defaultValues={defaultValues} />
          </div>
        </div>
      </div>
    </Portal>
  );
};
