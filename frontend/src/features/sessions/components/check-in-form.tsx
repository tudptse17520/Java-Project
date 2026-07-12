"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkInSchema, CheckInFormValues } from '../schemas/check-in-form.schema';
import { useCheckInVehicle } from '../hooks/use-sessions';
import { Camera, ScanLine, UserCheck, User, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface CheckInFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CheckInForm = ({ onSuccess, onCancel }: CheckInFormProps) => {
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<CheckInFormValues>({
    resolver: zodResolver(checkInSchema),
    defaultValues: {
      plate: '',
      vehicleId: undefined,
      parkingSlotId: undefined,
    }
  });

  const checkInMutation = useCheckInVehicle();
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [isScanning, setIsScanning] = useState(false);
  const [successData, setSuccessData] = useState<{ plate: string; slot: string; sessionId: string } | null>(null);

  const plateValue = watch('plate');

  // Mock checking member
  const isMember = plateValue && (plateValue.includes('51') || plateValue.includes('30'));
  const memberName = isMember ? "Nguyễn Văn A" : "Khách vãng lai";

  // Shortcuts F2, ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault();
        handleScanMock();
      }
      if (e.key === 'Escape') {
        reset();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [reset]);

  const handleScanMock = () => {
    setIsScanning(true);
    setTimeout(() => {
      setValue('plate', '51H-12345');
      setIsScanning(false);
      toast.success("Đã nhận diện biển số qua Camera!");
    }, 1500);
  };

  const onSubmit = (data: CheckInFormValues) => {
    checkInMutation.mutate({
      plate: data.plate.toUpperCase(),
      vehicleId: data.vehicleId ? Number(data.vehicleId) : null,
      parkingSlotId: data.parkingSlotId ? Number(data.parkingSlotId) : null,
    }, {
      onSuccess: (res: any) => {
        setSuccessData({
          plate: data.plate.toUpperCase(),
          slot: data.parkingSlotId ? `A-${data.parkingSlotId}` : "Chưa cấp",
          sessionId: res?.data?.id ? `#2026-00${res.data.id}` : `#2026-00125`
        });
        reset();
        if (onSuccess) onSuccess();
      },
      onError: (error: any) => {
        const status = error.response?.status;
        if (status === 409) {
          toast.error("Xe đang gửi trong bãi! Không thể tạo lượt mới.");
        } else {
          toast.error("Có lỗi xảy ra khi Check-in.");
        }
      }
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Camera Scan Area */}
        <div className="flex gap-4 mb-6">
          <div className="relative w-full h-32 bg-muted/50 rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 flex flex-col items-center justify-center overflow-hidden">
            {isScanning ? (
              <>
                <div className="absolute inset-0 bg-blue-500/10 animate-pulse" />
                <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 animate-[scan_2s_ease-in-out_infinite]" />
                <ScanLine className="h-8 w-8 text-blue-500 mb-2 animate-bounce" />
                <span className="text-sm font-medium text-blue-600">Đang quét biển số...</span>
              </>
            ) : (
              <>
                <Camera className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-sm font-medium text-muted-foreground">Camera Lối Vào</span>
              </>
            )}
          </div>
          <Button 
            type="button" 
            variant="outline" 
            className="h-32 flex flex-col gap-2 min-w-[120px]"
            onClick={handleScanMock}
            disabled={isScanning}
          >
            <ScanLine className="h-6 w-6" />
            <span>[F2] Quét QR</span>
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-end mb-2">
              <label className="block text-sm font-medium">
                Biển số xe <span className="text-destructive">*</span>
              </label>
              {plateValue && (
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${isMember ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                  {isMember ? <UserCheck className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                  {memberName}
                </div>
              )}
            </div>
            
            <Input 
              {...register('plate')} 
              placeholder="51H-12345" 
              className="text-4xl md:text-5xl font-bold uppercase h-20 text-center tracking-wider"
              autoFocus
              ref={(e) => {
                register('plate').ref(e);
                // @ts-ignore
                inputRef.current = e;
              }}
            />
            {errors.plate && (
              <p className="text-sm text-destructive mt-2 flex items-center gap-1">
                <AlertTriangle className="h-4 w-4" />
                {errors.plate.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-muted-foreground">Mã thẻ thành viên</label>
              <Input type="number" {...register('vehicleId', { setValueAs: v => v === "" ? undefined : parseInt(v, 10) })} placeholder="Tùy chọn" className="h-12 text-lg" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-muted-foreground">Vị trí đỗ (Slot)</label>
              <Input type="number" {...register('parkingSlotId', { setValueAs: v => v === "" ? undefined : parseInt(v, 10) })} placeholder="Tùy chọn" className="h-12 text-lg" />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button 
            type="submit" 
            className="w-full h-16 text-xl font-bold bg-emerald-600 hover:bg-emerald-700" 
            disabled={checkInMutation.isPending}
          >
            {checkInMutation.isPending ? 'ĐANG XỬ LÝ...' : 'CHECK-IN XE VÀO (ENTER)'}
          </Button>
          <p className="text-center text-xs text-muted-foreground mt-3">
            Phím tắt: [F2] Quét / Focus | [ESC] Xóa form | [Enter] Check-in
          </p>
        </div>
      </form>

      {/* Success Dialog */}
      <Dialog open={!!successData} onOpenChange={() => setSuccessData(null)}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-emerald-600 flex flex-col items-center gap-3">
              <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                <UserCheck className="h-8 w-8" />
              </div>
              Check-in thành công!
            </DialogTitle>
          </DialogHeader>
          <div className="py-6 space-y-4">
            <div className="bg-muted p-4 rounded-lg flex flex-col items-center">
              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Biển số</p>
              <p className="text-4xl font-bold text-primary">{successData?.plate}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Vị trí (Slot)</p>
                <p className="text-2xl font-bold text-emerald-600">{successData?.slot}</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Mã gửi</p>
                <p className="text-lg font-bold text-blue-600 mt-1">{successData?.sessionId}</p>
              </div>
            </div>
          </div>
          <DialogFooter className="sm:justify-center">
            <Button type="button" size="lg" className="w-full h-12 text-lg" onClick={() => setSuccessData(null)}>
              Đóng (Enter)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
