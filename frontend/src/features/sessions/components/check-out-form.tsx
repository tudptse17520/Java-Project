"use client";

import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, AlertTriangle, CheckCircle2, Camera, ScanLine, Clock, CreditCard, Ticket, Car, CheckCircle, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/status-badge";
import { formatCurrency } from "@/utils/format-currency";
import { formatDate } from "@/utils/format-date";
import dayjs from "dayjs";

import { useSessions } from "../hooks/use-sessions";
import { useCheckoutActions } from "../hooks/use-checkout-actions";
import {
  ValidatePlateFormValues,
  validatePlateSchema,
} from "../schemas/checkout.schema";
import { FeeCalculationResponse, ParkingSession } from "../types/session.type";
import { CHECKOUT_MESSAGES } from "../constants/session.constants";

import { OverrideCheckoutDialog } from "./override-checkout-dialog";
import { LostTicketDialog } from "./lost-ticket-dialog";

export function CheckOutForm() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSession, setSelectedSession] = useState<ParkingSession | null>(null);
  const [feeData, setFeeData] = useState<FeeCalculationResponse | null>(null);
  
  const [isOverrideOpen, setIsOverrideOpen] = useState(false);
  const [isLostTicketOpen, setIsLostTicketOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const plateOutInputRef = useRef<HTMLInputElement>(null);

  const { data: sessionsData, isLoading: isSearching } = useSessions({
    plate: searchTerm,
    status: "IN_PROGRESS" as any,
    enabled: searchTerm.length > 0,
  });

  const {
    validatePlateMutation,
    calculateFeeMutation,
    checkOutMutation,
  } = useCheckoutActions();

  const validateForm = useForm<ValidatePlateFormValues>({
    resolver: zodResolver(validatePlateSchema),
    defaultValues: { plateOut: "" },
  });

  // Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F3') {
        e.preventDefault();
        handleScanMock();
      }
      if (e.key === 'Escape') {
        setSearchTerm("");
        setSelectedSession(null);
        setFeeData(null);
        validateForm.reset();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [validateForm]);

  const handleSearch = () => {
    if (sessionsData && sessionsData.data.length > 0) {
      setSelectedSession(sessionsData.data[0]);
      setFeeData(null);
      validateForm.reset();
      // Auto focus plateOut input after finding session
      setTimeout(() => plateOutInputRef.current?.focus(), 100);
    } else {
      toast.error("Không tìm thấy xe đang gửi với biển số này");
    }
  };

  const handleScanMock = () => {
    setIsScanning(true);
    setTimeout(() => {
      setSearchTerm('51H-12345');
      setIsScanning(false);
      toast.success("Đã quét biển số từ Camera Ra!");
    }, 1500);
  };

  const onValidateSubmit = (values: ValidatePlateFormValues) => {
    if (!selectedSession) return;

    validatePlateMutation.mutate(
      {
        sessionId: selectedSession.id,
        request: {
          plateOut: values.plateOut.toUpperCase(),
          plateOutImage: "dummy_image_url_base64",
        },
      },
      {
        onSuccess: () => {
          toast.success(CHECKOUT_MESSAGES.VALIDATION_SUCCESS);
          // MOCK: Giả lập gọi API tính tiền thành công do Backend chưa có endpoint này
          setFeeData({
            baseFee: 5000,
            overtimeFee: 0,
            penaltyFee: 0,
            totalFee: 5000
          });
        },
        onError: (error: any) => {
          const status = error.response?.status;
          if (status === 409) {
            toast.error(CHECKOUT_MESSAGES.VALIDATION_ERROR);
            setIsOverrideOpen(true);
          } else {
            toast.error(error.response?.data?.message || "Lỗi xác thực biển số");
          }
        },
      }
    );
  };

  const handleCheckout = () => {
    if (!selectedSession) return;
    
    // MOCK: Giả lập gọi API checkout thành công do Backend chưa hỗ trợ đủ
    toast.success(CHECKOUT_MESSAGES.SUCCESS);
    setSelectedSession(null);
    setFeeData(null);
    setSearchTerm("");
    validateForm.reset();
    setTimeout(() => searchInputRef.current?.focus(), 100);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Cột trái: Tìm kiếm & Validate */}
      <div className="space-y-6">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6 border-b bg-muted/30">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Search className="h-5 w-5 text-blue-600" />
              Tra cứu xe ra
            </h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex gap-4">
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
                    <span className="text-sm font-medium text-muted-foreground">Camera Lối Ra</span>
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
                <span>[F3] Quét QR</span>
              </Button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Nhập biển số hoặc mã vé</label>
              <div className="flex gap-3">
                <input
                  ref={searchInputRef}
                  autoFocus
                  className="flex h-16 w-full rounded-lg border-2 border-input bg-background px-4 text-3xl font-bold uppercase ring-offset-background placeholder:text-muted-foreground placeholder:text-xl placeholder:font-normal focus-visible:outline-none focus-visible:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 tracking-wider"
                  placeholder="VD: 51H-12345"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button className="h-16 px-8 text-lg font-bold" onClick={handleSearch} disabled={isSearching}>
                  TÌM KIẾM
                </Button>
              </div>
            </div>
          </div>
        </div>

        {selectedSession && (
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6 border-b bg-emerald-50/50 dark:bg-emerald-900/10">
              <h3 className="font-semibold text-lg flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                <CheckCircle className="h-5 w-5" />
                Xác thực biển số lúc ra
              </h3>
            </div>
            <div className="p-6">
              <form onSubmit={validateForm.handleSubmit(onValidateSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Biển số nhận diện lúc ra <span className="text-destructive">*</span></label>
                  <input
                    className={cn(
                      "flex h-20 w-full rounded-lg border-2 bg-background px-4 text-4xl text-center font-bold uppercase ring-offset-background placeholder:text-muted-foreground placeholder:text-2xl placeholder:font-normal focus-visible:outline-none focus-visible:border-emerald-500 tracking-wider",
                      validateForm.formState.errors.plateOut ? "border-destructive focus-visible:border-destructive" : "border-input"
                    )}
                    placeholder="Quét biển số..."
                    {...validateForm.register("plateOut")}
                    ref={(e) => {
                      validateForm.register('plateOut').ref(e);
                      // @ts-ignore
                      plateOutInputRef.current = e;
                    }}
                  />
                  {validateForm.formState.errors.plateOut && (
                    <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4" />
                      {validateForm.formState.errors.plateOut.message}
                    </p>
                  )}
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  <Button type="submit" size="lg" className="col-span-2 h-14 text-lg font-bold bg-emerald-600 hover:bg-emerald-700" disabled={validatePlateMutation.isPending}>
                    {validatePlateMutation.isPending ? "ĐANG XỬ LÝ..." : "XÁC THỰC (ENTER)"}
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="lg"
                    className="h-14 font-bold"
                    onClick={() => setIsLostTicketOpen(true)}
                  >
                    MẤT VÉ
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Cột phải: Hóa Đơn - Receipt */}
      <div className="space-y-6">
        {selectedSession ? (
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm h-full flex flex-col">
            <div className="flex flex-col space-y-1.5 p-6 border-b bg-muted/30">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Ticket className="h-5 w-5 text-indigo-600" />
                Hóa đơn thanh toán
              </h3>
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              <div className="bg-muted/50 rounded-lg p-6 text-center border mb-6">
                <p className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Biển số xe</p>
                <p className="text-5xl font-black text-primary tracking-wider">{selectedSession.plate}</p>
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-background rounded-full border shadow-sm">
                  <Car className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Khách vãng lai</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-6 gap-x-4 text-sm mb-8 px-2">
                <div>
                  <p className="text-muted-foreground flex items-center gap-1.5 mb-1"><Ticket className="h-4 w-4"/> Mã phiên</p>
                  <p className="font-semibold text-base">#{selectedSession.id}</p>
                </div>
                <div>
                  <p className="text-muted-foreground flex items-center gap-1.5 mb-1"><MapPin className="h-4 w-4"/> Vị trí</p>
                  <p className="font-semibold text-base">A-14</p>
                </div>
                <div>
                  <p className="text-muted-foreground flex items-center gap-1.5 mb-1"><Clock className="h-4 w-4"/> Giờ vào</p>
                  <p className="font-semibold text-base">{formatDate(selectedSession.timeIn)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground flex items-center gap-1.5 mb-1"><Clock className="h-4 w-4"/> Giờ ra (Dự kiến)</p>
                  <p className="font-semibold text-base">{dayjs().format("DD/MM/YYYY HH:mm")}</p>
                </div>
              </div>

              {feeData ? (
                <div className="mt-auto border-t-2 border-dashed pt-6 space-y-4">
                  <div className="space-y-3 px-2">
                    <div className="flex justify-between items-center text-base">
                      <span className="text-muted-foreground">Phí cơ bản</span>
                      <span className="font-medium">{formatCurrency(feeData.baseFee)}</span>
                    </div>
                    {feeData.overtimeFee > 0 && (
                      <div className="flex justify-between items-center text-base text-amber-600">
                        <span>Phụ thu quá giờ</span>
                        <span className="font-medium">+{formatCurrency(feeData.overtimeFee)}</span>
                      </div>
                    )}
                    {feeData.penaltyFee > 0 && (
                      <div className="flex justify-between items-center text-base text-destructive">
                        <span>Phạt (Mất vé, sai thông tin)</span>
                        <span className="font-medium">+{formatCurrency(feeData.penaltyFee)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg mt-4">
                      <span className="text-lg font-bold text-indigo-700 dark:text-indigo-400">TỔNG CỘNG</span>
                      <span className="text-4xl font-black text-indigo-700 dark:text-indigo-400">
                        {formatCurrency(feeData.totalFee)}
                      </span>
                    </div>
                  </div>

                  <Button
                    className="w-full h-16 text-xl font-bold mt-4 bg-indigo-600 hover:bg-indigo-700"
                    onClick={handleCheckout}
                    disabled={checkOutMutation.isPending}
                  >
                    <CreditCard className="w-6 h-6 mr-2" />
                    {checkOutMutation.isPending ? "ĐANG XỬ LÝ..." : "THANH TOÁN & MỞ CỔNG"}
                  </Button>
                </div>
              ) : (
                <div className="mt-auto border-t-2 border-dashed pt-10 pb-6 flex flex-col items-center justify-center text-muted-foreground">
                  <Clock className="h-10 w-10 mb-3 opacity-20" />
                  <p>Vui lòng xác thực biển số để tính cước phí</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full min-h-[500px] flex flex-col items-center justify-center border-2 border-dashed rounded-xl text-muted-foreground bg-muted/10">
            <Search className="h-16 w-16 mb-4 opacity-20" />
            <p className="text-lg">Khu vực hiển thị hóa đơn thanh toán</p>
            <p className="text-sm mt-1">Tìm kiếm và chọn xe ra để bắt đầu</p>
          </div>
        )}
      </div>

      {selectedSession && (
        <>
          <OverrideCheckoutDialog
            sessionId={selectedSession.id}
            isOpen={isOverrideOpen}
            onClose={() => setIsOverrideOpen(false)}
            onSuccess={() => {
              calculateFeeMutation.mutate(selectedSession.id, {
                onSuccess: (data) => setFeeData(data),
              });
            }}
          />
          
          <LostTicketDialog
            sessionId={selectedSession.id}
            isOpen={isLostTicketOpen}
            onClose={() => setIsLostTicketOpen(false)}
            onSuccess={(data) => {
              setFeeData(data);
            }}
          />
        </>
      )}
    </div>
  );
}
