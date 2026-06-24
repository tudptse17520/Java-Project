"use client";

import { useState, useEffect } from "react";
import {
  VehicleType,
  VehicleTypeRequest,
  ApiError,
  createVehicleType,
  updateVehicleType,
} from "../services/vehicleTypeApi";

interface VehicleTypeFormProps {
  isOpen: boolean;
  editingVehicleType: VehicleType | null; // null = Thêm mới, có giá trị = Cập nhật
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

/**
 * Form modal component cho thêm mới và cập nhật loại phương tiện.
 * - Validate E1 (bỏ trống tên) ở phía client trước khi gửi API.
 * - Hiển thị lỗi E2 (trùng tên) từ Backend ngay trên form.
 */
export default function VehicleTypeForm({
  isOpen,
  editingVehicleType,
  onClose,
  onSuccess,
  onError,
}: VehicleTypeFormProps) {
  const [typeName, setTypeName] = useState("");
  const [description, setDescription] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = editingVehicleType !== null;

  // Điền sẵn dữ liệu cũ khi ở chế độ Cập nhật
  useEffect(() => {
    if (isOpen && editingVehicleType) {
      setTypeName(editingVehicleType.type_name);
      setDescription(editingVehicleType.description || "");
    } else if (isOpen) {
      setTypeName("");
      setDescription("");
    }
    setFieldError("");
  }, [isOpen, editingVehicleType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // E1: Validate rỗng ở client
    if (!typeName.trim()) {
      setFieldError("Tên loại phương tiện không được để trống.");
      return;
    }

    if (typeName.trim().length > 100) {
      setFieldError("Tên loại phương tiện không được vượt quá 100 ký tự.");
      return;
    }

    setIsSubmitting(true);
    setFieldError("");

    const requestData: VehicleTypeRequest = {
      type_name: typeName.trim(),
      description: description.trim() || undefined,
      status: isEditMode ? editingVehicleType.status : "ACTIVE",
    };

    try {
      if (isEditMode) {
        await updateVehicleType(editingVehicleType.id, requestData);
        onSuccess("Cập nhật loại phương tiện thành công!");
      } else {
        await createVehicleType(requestData);
        onSuccess("Thêm mới loại phương tiện thành công!");
      }
      onClose();
    } catch (error: unknown) {
      const apiError = error as ApiError;
      if (apiError && apiError.message) {
        // E2 (409) hoặc E1 (400) từ Backend
        if (apiError.status === 409) {
          setFieldError(apiError.message);
        } else {
          setFieldError(apiError.message);
        }
      } else {
        onError("Đã xảy ra lỗi không xác định. Vui lòng thử lại.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg mx-4 bg-slate-900 border border-slate-700/50
          rounded-2xl shadow-2xl animate-in"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isEditMode
                  ? "bg-indigo-500/15 text-indigo-400"
                  : "bg-emerald-500/15 text-emerald-400"
              }`}
            >
              {isEditMode ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">
                {isEditMode
                  ? "Cập nhật loại phương tiện"
                  : "Thêm loại phương tiện mới"}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {isEditMode
                  ? `Chỉnh sửa thông tin #${editingVehicleType.id}`
                  : "Nhập thông tin loại phương tiện"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700/50
              transition-colors cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-5">
            {/* Tên loại phương tiện */}
            <div>
              <label
                htmlFor="type-name-input"
                className="block text-sm font-semibold text-slate-300 mb-2"
              >
                Tên loại phương tiện <span className="text-red-400">*</span>
              </label>
              <input
                id="type-name-input"
                type="text"
                value={typeName}
                onChange={(e) => {
                  setTypeName(e.target.value);
                  setFieldError("");
                }}
                placeholder="VD: Ô tô 4 chỗ, Xe máy, Xe đạp..."
                maxLength={100}
                className={`w-full px-4 py-3 rounded-xl bg-slate-800/50 border text-slate-100
                  placeholder-slate-500 text-sm transition-all duration-200
                  focus:outline-none focus:ring-2
                  ${
                    fieldError
                      ? "border-red-500/50 focus:ring-red-500/30 focus:border-red-500"
                      : "border-slate-600/50 focus:ring-indigo-500/30 focus:border-indigo-500"
                  }
                `}
              />
              {/* Hiển thị lỗi E1/E2 */}
              {fieldError && (
                <div className="flex items-center gap-2 mt-2">
                  <svg
                    className="w-4 h-4 text-red-400 flex-shrink-0"
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
                  <p className="text-sm text-red-400">{fieldError}</p>
                </div>
              )}
            </div>

            {/* Mô tả */}
            <div>
              <label
                htmlFor="description-input"
                className="block text-sm font-semibold text-slate-300 mb-2"
              >
                Mô tả{" "}
                <span className="text-slate-500 font-normal">(Tùy chọn)</span>
              </label>
              <textarea
                id="description-input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Nhập mô tả chi tiết cho loại phương tiện..."
                maxLength={255}
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-600/50
                  text-slate-100 placeholder-slate-500 text-sm transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500
                  resize-none"
              />
              <p className="text-xs text-slate-500 mt-1 text-right">
                {description.length}/255
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-700/50">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold text-slate-300
                rounded-xl border border-slate-600/50 hover:bg-slate-700/50
                transition-all duration-200 cursor-pointer"
            >
              Hủy
            </button>
            <button
              id="submit-vehicle-type-btn"
              type="submit"
              disabled={isSubmitting}
              className={`px-5 py-2.5 text-sm font-semibold rounded-xl
                transition-all duration-200 cursor-pointer
                ${
                  isSubmitting
                    ? "bg-indigo-500/30 text-indigo-300/50 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white hover:from-indigo-500 hover:to-indigo-400 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 active:scale-[0.98]"
                }
              `}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-indigo-300/30 border-t-indigo-300 rounded-full animate-spin" />
                  Đang xử lý...
                </span>
              ) : isEditMode ? (
                "Cập nhật"
              ) : (
                "Lưu"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
