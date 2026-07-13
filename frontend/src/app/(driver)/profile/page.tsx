"use client";

import { useMemo, useState } from "react";
import { PageContainer } from "@/components/common/page-container";
import { PageHeader } from "@/components/common/page-header";
import { useAuthStore } from "@/stores/auth.store";
import { useQuery } from "@tanstack/react-query";
import { getPayments } from "@/services/payment.service";
import { sessionService } from "@/services/session.service";
import { formatDateTime } from "@/utils/format-date";
import { formatCurrency } from "@/utils/format-currency";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { EmptyState } from "@/components/common/empty-state";
import {
  User,
  Phone,
  Shield,
  CreditCard,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Wallet,
  Receipt,
  Car,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Profile Info Card
// ---------------------------------------------------------------------------
function ProfileInfoCard() {
  const { user } = useAuthStore();

  if (!user) return null;

  const roleLabel =
    user.role === "ROLE_USER"
      ? "Khách hàng"
      : user.role === "ROLE_STAFF"
      ? "Nhân viên"
      : user.role === "ROLE_MANAGER"
      ? "Quản lý"
      : user.role === "ROLE_ADMIN"
      ? "Quản trị viên"
      : user.role;

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-5">
        {/* Avatar */}
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary ring-4 ring-primary/20">
          <span className="text-2xl font-bold">
            {(user.fullName || user.username || "U").charAt(0).toUpperCase()}
          </span>
        </div>

        {/* Info */}
        <div className="flex-1 space-y-1">
          <h2 className="text-xl font-bold">{user.fullName || user.username}</h2>
          <p className="text-sm text-muted-foreground">@{user.username}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <InfoRow icon={User} label="Họ và tên" value={user.fullName || "Chưa cập nhật"} />
        <InfoRow icon={Phone} label="Số điện thoại" value={user.phoneNumber || "Chưa cập nhật"} />
        <InfoRow icon={Shield} label="Vai trò" value={roleLabel} />
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
      <Icon className="h-4 w-4 shrink-0 text-primary" />
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Active Session Summary
// ---------------------------------------------------------------------------
function ActiveSessionSummary() {
  const { user } = useAuthStore();

  const { data: sessionData, isLoading } = useQuery({
    queryKey: ["profile-active-sessions", user?.id],
    queryFn: () => sessionService.getUserSessions(user!.id!),
    enabled: !!user?.id,
  });

  if (isLoading) {
    return <div className="rounded-xl border bg-card p-6 shadow-sm"><LoadingSpinner text="Đang tải..." /></div>;
  }

  const sessions = sessionData?.data || [];
  const activeCount = sessions.filter((s) => s.status === "IN_PROGRESS").length;
  const completedCount = sessions.filter((s) => s.status === "COMPLETED").length;

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        <Car className="h-4 w-4" />
        Tổng quan lượt gửi xe
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          icon={Clock}
          label="Đang gửi"
          value={activeCount}
          color="text-emerald-600 dark:text-emerald-400"
          bg="bg-emerald-500/10"
        />
        <StatCard
          icon={CheckCircle2}
          label="Đã hoàn thành"
          value={completedCount}
          color="text-blue-600 dark:text-blue-400"
          bg="bg-blue-500/10"
        />
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  bg,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  color: string;
  bg: string;
}) {
  return (
    <div className={`flex items-center gap-3 rounded-lg ${bg} p-4`}>
      <Icon className={`h-5 w-5 ${color}`} />
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Payment History
// ---------------------------------------------------------------------------

const STATUS_CONFIG: Record<string, { icon: React.ComponentType<{ className?: string }>; label: string; className: string }> = {
  SUCCESS: {
    icon: CheckCircle2,
    label: "Thành công",
    className: "text-emerald-600 bg-emerald-500/10 dark:text-emerald-400",
  },
  PENDING: {
    icon: AlertCircle,
    label: "Đang chờ",
    className: "text-amber-600 bg-amber-500/10 dark:text-amber-400",
  },
  FAILED: {
    icon: XCircle,
    label: "Thất bại",
    className: "text-rose-600 bg-rose-500/10 dark:text-rose-400",
  },
  CANCELLED: {
    icon: XCircle,
    label: "Đã hủy",
    className: "text-gray-500 bg-gray-500/10 dark:text-gray-400",
  },
};

function PaymentHistory() {
  const [limit, setLimit] = useState(5);

  const { data: payments, isLoading, isError } = useQuery({
    queryKey: ["profile-payments"],
    queryFn: () => getPayments(),
  });

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <LoadingSpinner text="Đang tải lịch sử thanh toán..." />
      </div>
    );
  }

  if (isError || !payments) {
    return (
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <EmptyState
          title="Không thể tải dữ liệu"
          description="Đã xảy ra lỗi khi tải lịch sử thanh toán."
        />
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <EmptyState
          title="Chưa có giao dịch"
          description="Bạn chưa có giao dịch thanh toán nào trong hệ thống."
        />
      </div>
    );
  }

  const visiblePayments = payments.slice(0, limit);

  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          <Receipt className="h-4 w-4" />
          Lịch sử thanh toán
        </h3>
        <span className="text-xs text-muted-foreground">
          {payments.length} giao dịch
        </span>
      </div>

      <div className="divide-y">
        {visiblePayments.map((payment) => {
          const config = STATUS_CONFIG[payment.status] || STATUS_CONFIG.PENDING;
          const StatusIcon = config.icon;

          return (
            <div
              key={payment.id}
              className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-muted/30"
            >
              {/* Icon */}
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${config.className}`}>
                <StatusIcon className="h-5 w-5" />
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{payment.feeType || "Phí gửi xe"}</span>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${config.className}`}>
                    {config.label}
                  </span>
                </div>
                <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Wallet className="h-3 w-3" />
                    {payment.paymentMethod}
                  </span>
                  <span>•</span>
                  <span>{formatDateTime(payment.paymentTime)}</span>
                </div>
              </div>

              {/* Amount */}
              <span className="shrink-0 text-sm font-bold tabular-nums">
                {formatCurrency(payment.amount)}
              </span>
            </div>
          );
        })}
      </div>

      {payments.length > limit && (
        <div className="border-t px-6 py-3 text-center">
          <button
            onClick={() => setLimit((prev) => prev + 10)}
            className="text-sm font-medium text-primary hover:underline"
          >
            Xem thêm ({payments.length - limit} giao dịch còn lại)
          </button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Profile Page
// ---------------------------------------------------------------------------
export default function DriverProfilePage() {
  return (
    <PageContainer>
      <PageHeader
        title="Hồ sơ cá nhân"
        description="Thông tin tài khoản và lịch sử giao dịch của bạn."
      />

      <div className="mt-6 space-y-6">
        <ProfileInfoCard />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <ActiveSessionSummary />
          </div>
          <div className="lg:col-span-2">
            <PaymentHistory />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
