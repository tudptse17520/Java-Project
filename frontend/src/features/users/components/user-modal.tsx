"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  userCreateSchema,
  userUpdateSchema,
  type UserCreateFormData,
  type UserUpdateFormData,
} from "@/features/users/schemas/user-form.schema";
import { UserResponse } from "@/types/user.type";
import { Role, ROLE_LABELS } from "@/constants/role";
import {
  FormContainer,
  FormHeader,
  FormFields,
  FormActions,
} from "@/components/common/form-container";

// --------------------------------------------------
// Sub-component: Create Form (username + password visible)
// --------------------------------------------------
function CreateUserForm({
  onSubmit,
  onClose,
  isLoading,
  isOpen,
}: {
  onSubmit: (data: UserCreateFormData) => void;
  onClose: () => void;
  isLoading?: boolean;
  isOpen: boolean;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserCreateFormData>({
    resolver: zodResolver(userCreateSchema),
    defaultValues: {
      username: "",
      password: "",
      fullName: "",
      phoneNumber: "",
      role: Role.USER,
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        username: "",
        password: "",
        fullName: "",
        phoneNumber: "",
        role: Role.USER,
      });
    }
  }, [isOpen, reset]);

  return (
    <FormContainer onSubmit={handleSubmit(onSubmit)}>
      <FormHeader
        title="Thêm người dùng mới"
        description="Tạo tài khoản mới và phân quyền trong hệ thống."
      />

      <FormFields>
        {/* Username */}
        <div className="space-y-1">
          <label className="text-sm font-medium leading-none">
            Tên đăng nhập <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            placeholder="Nhập tên đăng nhập (tối thiểu 4 ký tự)"
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              errors.username && "border-destructive focus-visible:ring-destructive"
            )}
            {...register("username")}
          />
          {errors.username && (
            <p className="text-sm text-destructive">
              {errors.username.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="text-sm font-medium leading-none">
            Mật khẩu <span className="text-destructive">*</span>
          </label>
          <input
            type="password"
            placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              errors.password && "border-destructive focus-visible:ring-destructive"
            )}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-sm text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Full Name */}
        <div className="space-y-1">
          <label className="text-sm font-medium leading-none">
            Họ và tên <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            placeholder="Nhập họ và tên"
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              errors.fullName && "border-destructive focus-visible:ring-destructive"
            )}
            {...register("fullName")}
          />
          {errors.fullName && (
            <p className="text-sm text-destructive">
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div className="space-y-1">
          <label className="text-sm font-medium leading-none">
            Số điện thoại <span className="text-destructive">*</span>
          </label>
          <input
            type="tel"
            placeholder="Nhập số điện thoại (VD: 0912345678)"
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              errors.phoneNumber && "border-destructive focus-visible:ring-destructive"
            )}
            {...register("phoneNumber")}
          />
          {errors.phoneNumber && (
            <p className="text-sm text-destructive">
              {errors.phoneNumber.message}
            </p>
          )}
        </div>

        {/* Role */}
        <div className="space-y-1">
          <label className="text-sm font-medium leading-none">
            Vai trò <span className="text-destructive">*</span>
          </label>
          <select
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              errors.role && "border-destructive focus-visible:ring-destructive"
            )}
            {...register("role")}
          >
            <option value="">Chọn vai trò</option>
            {Object.values(Role).map((r) => (
              <option key={r} value={r}>
                {ROLE_LABELS[r]}
              </option>
            ))}
          </select>
          {errors.role && (
            <p className="text-sm text-destructive">
              {errors.role.message}
            </p>
          )}
        </div>
      </FormFields>

      <FormActions>
        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
          Hủy
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Đang lưu..." : "Lưu lại"}
        </Button>
      </FormActions>
    </FormContainer>
  );
}

// --------------------------------------------------
// Sub-component: Edit Form (username + password hidden)
// --------------------------------------------------
function EditUserForm({
  onSubmit,
  onClose,
  isLoading,
  initialData,
}: {
  onSubmit: (data: UserUpdateFormData) => void;
  onClose: () => void;
  isLoading?: boolean;
  initialData: UserResponse;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserUpdateFormData>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      fullName: initialData.fullName,
      phoneNumber: initialData.phoneNumber,
      role: initialData.role,
    },
  });

  useEffect(() => {
    reset({
      fullName: initialData.fullName,
      phoneNumber: initialData.phoneNumber,
      role: initialData.role,
    });
  }, [initialData, reset]);

  return (
    <FormContainer onSubmit={handleSubmit(onSubmit)}>
      <FormHeader
        title="Cập nhật tài khoản"
        description="Thay đổi thông tin thành viên hiện tại."
      />

      <FormFields>
        {/* Full Name */}
        <div className="space-y-1">
          <label className="text-sm font-medium leading-none">
            Họ và tên <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            placeholder="Nhập họ và tên"
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              errors.fullName && "border-destructive focus-visible:ring-destructive"
            )}
            {...register("fullName")}
          />
          {errors.fullName && (
            <p className="text-sm text-destructive">
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div className="space-y-1">
          <label className="text-sm font-medium leading-none">
            Số điện thoại <span className="text-destructive">*</span>
          </label>
          <input
            type="tel"
            placeholder="Nhập số điện thoại (VD: 0912345678)"
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              errors.phoneNumber && "border-destructive focus-visible:ring-destructive"
            )}
            {...register("phoneNumber")}
          />
          {errors.phoneNumber && (
            <p className="text-sm text-destructive">
              {errors.phoneNumber.message}
            </p>
          )}
        </div>

        {/* Role */}
        <div className="space-y-1">
          <label className="text-sm font-medium leading-none">
            Vai trò <span className="text-destructive">*</span>
          </label>
          <select
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              errors.role && "border-destructive focus-visible:ring-destructive"
            )}
            {...register("role")}
          >
            <option value="">Chọn vai trò</option>
            {Object.values(Role).map((r) => (
              <option key={r} value={r}>
                {ROLE_LABELS[r]}
              </option>
            ))}
          </select>
          {errors.role && (
            <p className="text-sm text-destructive">
              {errors.role.message}
            </p>
          )}
        </div>
      </FormFields>

      <FormActions>
        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
          Hủy
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Đang lưu..." : "Lưu lại"}
        </Button>
      </FormActions>
    </FormContainer>
  );
}

// --------------------------------------------------
// Main: UserModal
// --------------------------------------------------
interface UserModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UserCreateFormData | UserUpdateFormData) => void;
  initialData?: UserResponse | null;
  isLoading?: boolean;
}

export function UserModal({
  open,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}: UserModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Content */}
      <div className="relative z-50 w-full max-w-lg rounded-lg border bg-background p-6 shadow-lg">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        {initialData ? (
          <EditUserForm
            onSubmit={onSubmit}
            onClose={onClose}
            isLoading={isLoading}
            initialData={initialData}
          />
        ) : (
          <CreateUserForm
            onSubmit={onSubmit}
            onClose={onClose}
            isLoading={isLoading}
            isOpen={open}
          />
        )}
      </div>
    </div>
  );
}
