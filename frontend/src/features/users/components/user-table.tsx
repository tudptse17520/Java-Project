"use client";

import { useMemo, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/common/data-table";
import { UserResponse } from "@/types/user.type";
import { UserRoleBadge } from "./user-role-badge";
import { UserStatusBadge } from "./user-status-badge";
import { Button } from "@/components/ui/button";
import { Edit2, Lock, Unlock } from "lucide-react";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { useUpdateUserStatus } from "../hooks/use-users";

interface UserTableProps {
  data: UserResponse[];
  isLoading: boolean;
  onEdit: (user: UserResponse) => void;
}

export function UserTable({ data, isLoading, onEdit }: UserTableProps) {
  const [confirmUser, setConfirmUser] = useState<UserResponse | null>(null);
  const updateStatusMutation = useUpdateUserStatus();

  const handleToggleStatus = () => {
    if (!confirmUser) return;
    const newStatus = confirmUser.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    updateStatusMutation.mutate(
      { id: confirmUser.id, status: newStatus },
      {
        onSuccess: () => {
          setConfirmUser(null);
        },
      }
    );
  };

  const columns = useMemo<ColumnDef<UserResponse>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => (
          <span className="tabular-nums font-mono text-muted-foreground">{row.original.id}</span>
        ),
      },
      {
        accessorKey: "username",
        header: "Tên đăng nhập",
        cell: ({ row }) => (
          <span className="font-semibold text-foreground">{row.original.username}</span>
        ),
      },
      {
        accessorKey: "fullName",
        header: "Họ và tên",
      },
      {
        accessorKey: "phoneNumber",
        header: "Số điện thoại",
        cell: ({ row }) => (
          <span className="tabular-nums">{row.original.phoneNumber || "—"}</span>
        ),
      },
      {
        accessorKey: "role",
        header: "Vai trò",
        cell: ({ row }) => <UserRoleBadge role={row.original.role} />,
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => <UserStatusBadge status={row.original.status} />,
      },
      {
        id: "actions",
        header: "Thao tác",
        cell: ({ row }) => {
          const user = row.original;
          const isActive = user.status === "ACTIVE";

          return (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/15 transition-colors"
                onClick={() => onEdit(user)}
                title="Cập nhật tài khoản"
                aria-label="Cập nhật tài khoản"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 transition-colors ${
                  isActive
                    ? "text-muted-foreground hover:text-rose-500 hover:bg-rose-500/15"
                    : "text-muted-foreground hover:text-emerald-500 hover:bg-emerald-500/15"
                }`}
                onClick={() => setConfirmUser(user)}
                title={isActive ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                aria-label={isActive ? "Khóa tài khoản" : "Mở khóa tài khoản"}
              >
                {isActive ? (
                  <Lock className="h-4 w-4" />
                ) : (
                  <Unlock className="h-4 w-4" />
                )}
              </Button>
            </div>
          );
        },
      },
    ],
    [onEdit]
  );

  return (
    <>
      <div className="w-full">
        <DataTable columns={columns} data={data} isLoading={isLoading} />
      </div>

      <ConfirmDialog
        open={!!confirmUser}
        onClose={() => setConfirmUser(null)}
        onConfirm={handleToggleStatus}
        title={confirmUser?.status === "ACTIVE" ? "Khóa tài khoản" : "Mở khóa tài khoản"}
        description={
          confirmUser?.status === "ACTIVE"
            ? `Bạn có chắc chắn muốn khóa tài khoản "${confirmUser?.fullName}" không? Người này sẽ không thể đăng nhập vào hệ thống.`
            : `Bạn có chắc chắn muốn mở khóa tài khoản "${confirmUser?.fullName}" không?`
        }
        confirmText={confirmUser?.status === "ACTIVE" ? "Khóa tài khoản" : "Mở khóa"}
        cancelText="Hủy bỏ"
        variant={confirmUser?.status === "ACTIVE" ? "danger" : "default"}
        isLoading={updateStatusMutation.isPending}
      />
    </>
  );
}
