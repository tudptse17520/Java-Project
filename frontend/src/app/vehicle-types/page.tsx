"use client";

import { useState, useEffect, useCallback } from "react";
import "./styles.css";
import { VehicleType, getAllVehicleTypes } from "./services/vehicleTypeApi";
import VehicleTypeTable from "./components/VehicleTypeTable";
import VehicleTypeForm from "./components/VehicleTypeForm";
import DeactivateModal from "./components/DeactivateModal";
import Toast, { ToastData } from "./components/Toast";

/**
 * Trang chính: Quản lý loại phương tiện.
 * URL: /vehicle-types
 *
 * Chức năng:
 * - Xem danh sách loại phương tiện (GET)
 * - Thêm mới loại phương tiện (POST)
 * - Cập nhật thông tin (PUT)
 * - Ngừng áp dụng (PATCH deactivate)
 */
export default function VehicleTypesPage() {
  // ==================== State ====================
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVehicleType, setEditingVehicleType] =
    useState<VehicleType | null>(null);

  // Deactivate modal state
  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);
  const [deactivatingVehicleType, setDeactivatingVehicleType] =
    useState<VehicleType | null>(null);

  // Toast state
  const [toasts, setToasts] = useState<ToastData[]>([]);

  // ==================== Toast helpers ====================
  const addToast = useCallback((message: string, type: "success" | "error") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ==================== Fetch data ====================
  const fetchVehicleTypes = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAllVehicleTypes();
      setVehicleTypes(data);
    } catch {
      addToast("Không thể tải danh sách loại phương tiện.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchVehicleTypes();
  }, [fetchVehicleTypes]);

  // ==================== Handlers ====================

  // Mở form thêm mới
  const handleOpenCreate = () => {
    setEditingVehicleType(null);
    setIsFormOpen(true);
  };

  // Mở form cập nhật
  const handleOpenEdit = (vehicleType: VehicleType) => {
    setEditingVehicleType(vehicleType);
    setIsFormOpen(true);
  };

  // Mở modal ngừng áp dụng
  const handleOpenDeactivate = (vehicleType: VehicleType) => {
    setDeactivatingVehicleType(vehicleType);
    setIsDeactivateOpen(true);
  };

  // Khi form thêm/sửa thành công
  const handleFormSuccess = (message: string) => {
    addToast(message, "success");
    fetchVehicleTypes(); // Reload bảng
  };

  // Khi ngừng áp dụng thành công
  const handleDeactivateSuccess = (message: string) => {
    addToast(message, "success");
    fetchVehicleTypes(); // Reload bảng
  };

  // Khi có lỗi
  const handleError = (message: string) => {
    addToast(message, "error");
  };

  // ==================== Render ====================

  // Đếm số lượng
  const activeCount = vehicleTypes.filter((v) => v.status === "ACTIVE").length;
  const inactiveCount = vehicleTypes.filter(
    (v) => v.status === "INACTIVE"
  ).length;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Toast notifications */}
      <Toast toasts={toasts} onRemove={removeToast} />

      {/* Form modal */}
      <VehicleTypeForm
        isOpen={isFormOpen}
        editingVehicleType={editingVehicleType}
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleFormSuccess}
        onError={handleError}
      />

      {/* Deactivate modal */}
      <DeactivateModal
        isOpen={isDeactivateOpen}
        vehicleType={deactivatingVehicleType}
        onClose={() => setIsDeactivateOpen(false)}
        onSuccess={handleDeactivateSuccess}
        onError={handleError}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-slate-100">
                Quản lý loại phương tiện
              </h1>
            </div>
            <p className="text-sm text-slate-400 ml-[52px]">
              Quản lý danh mục các loại phương tiện trong hệ thống bãi đỗ xe.
            </p>
          </div>

          {/* Add new button */}
          <button
            id="add-vehicle-type-btn"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold
              bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl
              shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40
              hover:from-indigo-500 hover:to-indigo-400
              transition-all duration-200 active:scale-[0.98] cursor-pointer
              self-start sm:self-auto"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Thêm loại phương tiện
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {/* Tổng số */}
          <div
            className="px-5 py-4 rounded-xl bg-slate-800/40 border border-slate-700/40
            flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-slate-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Tổng số</p>
              <p className="text-xl font-bold text-slate-100">
                {vehicleTypes.length}
              </p>
            </div>
          </div>

          {/* Đang hoạt động */}
          <div
            className="px-5 py-4 rounded-xl bg-emerald-950/30 border border-emerald-500/20
            flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-500/15 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-emerald-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs text-emerald-400/70 font-medium">
                Đang hoạt động
              </p>
              <p className="text-xl font-bold text-emerald-300">
                {activeCount}
              </p>
            </div>
          </div>

          {/* Ngừng áp dụng */}
          <div
            className="px-5 py-4 rounded-xl bg-slate-800/30 border border-slate-600/30
            flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-lg bg-slate-600/20 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-slate-400"
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
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">
                Ngừng áp dụng
              </p>
              <p className="text-xl font-bold text-slate-400">
                {inactiveCount}
              </p>
            </div>
          </div>
        </div>

        {/* Table */}
        <VehicleTypeTable
          vehicleTypes={vehicleTypes}
          isLoading={isLoading}
          onEdit={handleOpenEdit}
          onDeactivate={handleOpenDeactivate}
        />
      </div>
    </div>
  );
}
