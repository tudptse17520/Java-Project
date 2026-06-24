"use client";

import { useState } from "react";
import {
  VehicleType,
  ApiError,
  deactivateVehicleType,
} from "../services/vehicleTypeApi";

interface DeactivateModalProps {
  isOpen: boolean;
  vehicleType: VehicleType | null;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

/**
 * Modal xác nhận ngừng áp dụng loại phương tiện.
 * - Hiển thị tên loại phương tiện sắp bị ngừng.
 * - Nếu Backend trả lỗi E3 (đang có xe đỗ / bảng giá liên kết), hiển thị cảnh báo đỏ.
 */
export default function DeactivateModal({
  isOpen,
  vehicleType,
  onClose,
  onSuccess,
  onError,
}: DeactivateModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleDeactivate = async () => {
    if (!vehicleType) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await deactivateVehicleType(vehicleType.id);
      onSuccess(
        `Đã ngừng áp dụng loại phương tiện "${vehicleType.type_name}" thành công!`
      );
      onClose();
    } catch (error: unknown) {
      const apiError = error as ApiError;
      if (apiError && apiError.message) {
        // E3: Hiển thị lý do không thể ngừng áp dụng
        setErrorMessage(apiError.message);
      } else {
        onError("Đã xảy ra lỗi không xác định. Vui lòng thử lại.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setErrorMessage("");
    onClose();
  };

  if (!isOpen || !vehicleType) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md mx-4 bg-slate-900 border border-slate-700/50
          rounded-2xl shadow-2xl animate-in"
      >
        {/* Header */}
        <div className="flex flex-col items-center pt-8 pb-2 px-6">
          {/* Warning Icon */}
          <div className="w-16 h-16 rounded-2xl bg-amber-500/15 flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-amber-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h2 className="text-lg font-bold text-slate-100 text-center">
            Xác nhận ngừng áp dụng
          </h2>
          <p className="text-sm text-slate-400 text-center mt-2 leading-relaxed">
            Bạn có chắc chắn muốn ngừng áp dụng loại phương tiện{" "}
            <span className="font-semibold text-amber-300">
              &quot;{vehicleType.type_name}&quot;
            </span>{" "}
            không?
          </p>
          <p className="text-xs text-slate-500 text-center mt-1.5">
            Hệ thống sẽ không tiếp nhận xe thuộc danh mục này sau khi ngừng.
          </p>
        </div>

        {/* Error message E3 */}
        {errorMessage && (
          <div className="mx-6 mt-4 px-4 py-3 rounded-xl bg-red-950/50 border border-red-500/30">
            <div className="flex items-start gap-2.5">
              <svg
                className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                />
              </svg>
              <div>
                <p className="text-sm font-semibold text-red-300">
                  Không thể ngừng áp dụng
                </p>
                <p className="text-sm text-red-400 mt-1">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-5 mt-2">
          <button
            type="button"
            onClick={handleClose}
            className="px-5 py-2.5 text-sm font-semibold text-slate-300
              rounded-xl border border-slate-600/50 hover:bg-slate-700/50
              transition-all duration-200 cursor-pointer"
          >
            {errorMessage ? "Đóng" : "Hủy"}
          </button>
          {!errorMessage && (
            <button
              id="confirm-deactivate-btn"
              type="button"
              onClick={handleDeactivate}
              disabled={isSubmitting}
              className={`px-5 py-2.5 text-sm font-semibold rounded-xl
                transition-all duration-200 cursor-pointer
                ${
                  isSubmitting
                    ? "bg-amber-500/30 text-amber-300/50 cursor-not-allowed"
                    : "bg-gradient-to-r from-amber-600 to-amber-500 text-white hover:from-amber-500 hover:to-amber-400 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 active:scale-[0.98]"
                }
              `}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-amber-300/30 border-t-amber-300 rounded-full animate-spin" />
                  Đang xử lý...
                </span>
              ) : (
                "Xác nhận ngừng áp dụng"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
