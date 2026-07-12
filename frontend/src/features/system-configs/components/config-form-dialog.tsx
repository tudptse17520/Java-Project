"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormContainer, FormHeader, FormFields, FormActions } from "@/components/common/form-container";

import { SystemConfig } from "../types/config.type";
import { systemConfigSchema, SystemConfigFormValues } from "../schemas/config.schema";
import { useConfigActions } from "../hooks/use-config-actions";

interface ConfigFormDialogProps {
  config: SystemConfig | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ConfigFormDialog({
  config,
  isOpen,
  onClose,
}: ConfigFormDialogProps) {
  const { updateConfigMutation } = useConfigActions();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SystemConfigFormValues>({
    resolver: zodResolver(systemConfigSchema),
    defaultValues: {
      configValue: "",
      description: "",
    },
  });

  useEffect(() => {
    if (config && isOpen) {
      reset({
        configValue: config.configValue,
        description: config.description,
      });
    } else if (!isOpen) {
      reset({
        configValue: "",
        description: "",
      });
    }
  }, [config, isOpen, reset]);

  const onSubmit = (values: SystemConfigFormValues) => {
    if (!config) return;

    updateConfigMutation.mutate(
      {
        id: config.id,
        request: values,
      },
      {
        onSuccess: () => {
          toast.success("Cập nhật cấu hình thành công");
          onClose();
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || "Lỗi khi cập nhật cấu hình");
        },
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity" 
        onClick={onClose} 
        aria-hidden="true" 
      />

      {/* Modal Content */}
      <div className="relative z-50 w-full max-w-md rounded-lg bg-background p-6 shadow-lg">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
          type="button"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Đóng</span>
        </button>

        <FormContainer onSubmit={handleSubmit(onSubmit)}>
          <FormHeader 
            title="Cập nhật Cấu hình" 
            description="Thay đổi giá trị của cấu hình hệ thống."
          />

          <FormFields>
            <div className="space-y-2">
              <Label htmlFor="configKey">Khóa cấu hình (Không được sửa)</Label>
              <Input
                id="configKey"
                value={config?.configKey || ""}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="configValue">
                Giá trị <span className="text-destructive">*</span>
              </Label>
              <Input
                id="configValue"
                placeholder="Nhập giá trị..."
                {...register("configValue")}
                className={errors.configValue ? "border-destructive focus-visible:ring-destructive" : ""}
                disabled={updateConfigMutation.isPending}
              />
              {errors.configValue && (
                <p className="text-sm text-destructive">{errors.configValue.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Mô tả <span className="text-destructive">*</span>
              </Label>
              <Input
                id="description"
                placeholder="Nhập mô tả..."
                {...register("description")}
                className={errors.description ? "border-destructive focus-visible:ring-destructive" : ""}
                disabled={updateConfigMutation.isPending}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>
          </FormFields>

          <FormActions>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={updateConfigMutation.isPending}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={updateConfigMutation.isPending}>
              {updateConfigMutation.isPending ? "Đang xử lý..." : "Lưu thay đổi"}
            </Button>
          </FormActions>
        </FormContainer>
      </div>
    </div>
  );
}
