"use client";

import { VehicleType } from "../services/vehicleTypeApi";

interface VehicleTypeTableProps {
  vehicleTypes: VehicleType[];
  isLoading: boolean;
  onEdit: (vehicleType: VehicleType) => void;
  onDeactivate: (vehicleType: VehicleType) => void;
}

/**
 * Bảng hiển thị danh sách loại phương tiện.
 * Cột: ID, Tên, Mô tả, Trạng thái, Thao tác.
 * Badge: ACTIVE = xanh lá, INACTIVE = xám.
 * Nút: "Cập nhật" và "Ngừng áp dụng" (ẩn nếu đã INACTIVE).
 */
export default function VehicleTypeTable({
  vehicleTypes,
  isLoading,
  onEdit,
  onDeactivate,
}: VehicleTypeTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm font-medium">
            Đang tải dữ liệu...
          </p>
        </div>
      </div>
    );
  }

  if (vehicleTypes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-slate-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-slate-300 font-semibold">Chưa có dữ liệu</p>
          <p className="text-slate-500 text-sm mt-1">
            Nhấn &quot;Thêm loại phương tiện&quot; để bắt đầu.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-700/50">
      <div className="overflow-x-auto">
        <table className="w-full text-left" id="vehicle-type-table">
          <thead>
            <tr className="bg-slate-800/80 border-b border-slate-700/50">
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                ID
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Tên loại phương tiện
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Mô tả
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Trạng thái
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400 text-right">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/30">
            {vehicleTypes.map((vt) => (
              <tr
                key={vt.id}
                className="bg-slate-900/30 hover:bg-slate-800/50 transition-colors duration-200"
              >
                {/* ID */}
                <td className="px-6 py-4">
                  <span className="text-sm font-mono text-slate-400">
                    #{vt.id}
                  </span>
                </td>

                {/* Tên */}
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-slate-100">
                    {vt.type_name}
                  </span>
                </td>

                {/* Mô tả */}
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-400">
                    {vt.description || "—"}
                  </span>
                </td>

                {/* Trạng thái */}
                <td className="px-6 py-4">
                  <StatusBadge status={vt.status} />
                </td>

                {/* Thao tác */}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    {/* Nút Cập nhật */}
                    <button
                      id={`edit-vehicle-type-${vt.id}`}
                      onClick={() => onEdit(vt)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold
                        rounded-lg border border-indigo-500/30 text-indigo-300
                        bg-indigo-500/10 hover:bg-indigo-500/20 hover:border-indigo-400/50
                        transition-all duration-200 cursor-pointer"
                    >
                      <svg
                        className="w-3.5 h-3.5"
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
                      Cập nhật
                    </button>

                    {/* Nút Ngừng áp dụng (chỉ hiển thị khi ACTIVE) */}
                    {vt.status === "ACTIVE" && (
                      <button
                        id={`deactivate-vehicle-type-${vt.id}`}
                        onClick={() => onDeactivate(vt)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold
                          rounded-lg border border-amber-500/30 text-amber-300
                          bg-amber-500/10 hover:bg-amber-500/20 hover:border-amber-400/50
                          transition-all duration-200 cursor-pointer"
                      >
                        <svg
                          className="w-3.5 h-3.5"
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
                        Ngừng áp dụng
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * Status Badge component.
 * ACTIVE = green pill, INACTIVE = gray pill.
 */
function StatusBadge({ status }: { status: string }) {
  const isActive = status === "ACTIVE";
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
        ${
          isActive
            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
            : "bg-slate-600/15 text-slate-400 border border-slate-500/25"
        }
      `}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isActive ? "bg-emerald-400 animate-pulse" : "bg-slate-500"
        }`}
      />
      {isActive ? "Đang hoạt động" : "Ngừng áp dụng"}
    </span>
  );
}
