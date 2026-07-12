"use client";

import { useState } from "react";
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

  const { data, isLoading, isError, refetch } = useUsers(keyword, role);

  const {
    isModalOpen,
    selectedUser,
    isMutating,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseModal,
    handleModalSubmit,
  } = useUserActions();

  const users = data?.data || [];

  return (
    <PageContainer>
      <PageHeader
        title="Quản lý tài khoản"
        description="Quản lý thông tin, phân quyền và trạng thái hoạt động của nhân viên và khách hàng."
        actions={
          <Button onClick={handleOpenCreate}>
            <Plus className="mr-2 h-4 w-4" /> Thêm mới
          </Button>
        }
      />

      <Toolbar>
        <UserFilter
          keyword={keyword}
          role={role}
          onKeywordChange={setKeyword}
          onRoleChange={setRole}
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
