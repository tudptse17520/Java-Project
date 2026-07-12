"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PageContainer } from "@/components/common/page-container";
import { PageHeader } from "@/components/common/page-header";
import { Toolbar } from "@/components/common/toolbar";
import { UserTable } from "@/features/users/components/user-table";
import { UserFilter } from "@/features/users/components/user-filter";
import { UserModal } from "@/features/users/components/user-modal";
import { useUsers } from "@/features/users/hooks/use-users";
import { useUserActions } from "@/features/users/hooks/use-user-actions";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";

export default function UsersPage() {
  const [keyword, setKeyword] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();

  const { data, isLoading, isError, refetch } = useUsers(keyword, role, status);

  const {
    isModalOpen,
    selectedUser,
    isMutating,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseModal,
    handleModalSubmit,
  } = useUserActions();

  useEffect(() => {
    if (searchParams.get("action") === "create") {
      handleOpenCreate();
      router.replace("/admin/users"); // Remove the param so it doesn't open again on refresh
    }
  }, [searchParams, router, handleOpenCreate]);

  const users = data?.data || [];

  return (
    <PageContainer>
      <PageHeader
        title="Quản lý tài khoản"
        description="Quản lý thông tin, phân quyền và trạng thái hoạt động của nhân viên và khách hàng."
        actions={
          <Button 
            onClick={handleOpenCreate} 
            className="shadow-sm hover:shadow-md hover:brightness-110 transition-all"
          >
            <Plus className="mr-2 h-4.5 w-4.5" /> Thêm mới
          </Button>
        }
      />

      <Toolbar className="mb-4">
        <UserFilter
          keyword={keyword}
          role={role}
          status={status}
          onKeywordChange={setKeyword}
          onRoleChange={setRole}
          onStatusChange={setStatus}
        />
      </Toolbar>

      {isError ? (
        <EmptyState
          icon={Users}
          title="Không thể tải dữ liệu"
          description="Đã xảy ra lỗi khi tải danh sách người dùng. Vui lòng thử lại sau."
          action={
            <Button variant="outline" onClick={() => refetch()}>
              Thử lại
            </Button>
          }
        />
      ) : !isLoading && users.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Không tìm thấy người dùng"
          description="Thử thay đổi từ khóa hoặc bộ lọc để tìm kiếm."
          action={
            <Button
              variant="outline"
              onClick={() => {
                setKeyword("");
                setRole("");
              }}
            >
              Đặt lại bộ lọc
            </Button>
          }
        />
      ) : (
        <UserTable
          data={users}
          isLoading={isLoading}
          onEdit={handleOpenEdit}
        />
      )}

      <UserModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
        initialData={selectedUser}
        isLoading={isMutating}
      />
    </PageContainer>
  );
}
