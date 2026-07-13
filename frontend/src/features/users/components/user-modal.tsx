"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Portal } from "@/components/common/portal";

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
        <div className="space-y-1.5">
          <Label>
            Tên đăng nhập <span className="text-destructive">*</span>
          </Label>
          <Input
            type="text"
            placeholder="Nhập tên đăng nhập (tối thiểu 4 ký tự)"
            className={cn(
              errors.username && "border-destructive focus-visible:ring-destructive/30"
            )}
            {...register("username")}
          />
          {errors.username && (
            <p className="text-xs text-destructive">
              {errors.username.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <Label>
            Mật khẩu <span className="text-destructive">*</span>
          </Label>
          <Input
            type="password"
            placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
            className={cn(
              errors.password && "border-destructive focus-visible:ring-destructive/30"
            )}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Full Name */}
        <div className="space-y-1.5">
          <Label>
            Họ và tên <span className="text-destructive">*</span>
          </Label>
          <Input
            type="text"
            placeholder="Nhập họ và tên"
            className={cn(
              errors.fullName && "border-destructive focus-visible:ring-destructive/30"
            )}
            {...register("fullName")}
          />
          {errors.fullName && (
            <p className="text-xs text-destructive">
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div className="space-y-1.5">
          <Label>
            Số điện thoại <span className="text-destructive">*</span>
          </Label>
          <Input
            type="tel"
            placeholder="Nhập số điện thoại (VD: 0912345678)"
            className={cn(
              errors.phoneNumber && "border-destructive focus-visible:ring-destructive/30"
            )}
            {...register("phoneNumber")}
          />
          {errors.phoneNumber && (
            <p className="text-xs text-destructive">
              {errors.phoneNumber.message}
            </p>
          )}
        </div>

        {/* Role */}
        <div className="space-y-1.5">
          <Label>
            Vai trò <span className="text-destructive">*</span>
          </Label>
          <select
            className={cn(
              "flex h-11 w-full rounded-lg border border-input bg-background px-3.5 py-2 text-sm shadow-sm transition-colors duration-200 hover:border-ring/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50",
              errors.role && "border-destructive focus-visible:ring-destructive/30"
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
            <p className="text-xs text-destructive">
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
        <div className="space-y-1.5">
          <Label>
            Họ và tên <span className="text-destructive">*</span>
          </Label>
          <Input
            type="text"
            placeholder="Nhập họ và tên"
            className={cn(
              errors.fullName && "border-destructive focus-visible:ring-destructive/30"
            )}
            {...register("fullName")}
          />
          {errors.fullName && (
            <p className="text-xs text-destructive">
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div className="space-y-1.5">
          <Label>
            Số điện thoại <span className="text-destructive">*</span>
          </Label>
          <Input
            type="tel"
            placeholder="Nhập số điện thoại (VD: 0912345678)"
            className={cn(
              errors.phoneNumber && "border-destructive focus-visible:ring-destructive/30"
            )}
            {...register("phoneNumber")}
          />
          {errors.phoneNumber && (
            <p className="text-xs text-destructive">
              {errors.phoneNumber.message}
            </p>
          )}
        </div>

        {/* Role */}
        <div className="space-y-1.5">
          <Label>
            Vai trò <span className="text-destructive">*</span>
          </Label>
          <select
            className={cn(
              "flex h-11 w-full rounded-lg border border-input bg-background px-3.5 py-2 text-sm shadow-sm transition-colors duration-200 hover:border-ring/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50",
              errors.role && "border-destructive focus-visible:ring-destructive/30"
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
            <p className="text-xs text-destructive">
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
    <Portal>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal Dialog Content */}
        <div className="relative z-50 w-full max-w-lg rounded-xl border border-border/60 bg-background p-6 shadow-xl animate-scale-in">
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground/60 hover:text-foreground hover:bg-muted transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring/30"
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
    </Portal>
  );
}
