"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { X, Save, ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormContainer, FormHeader, FormFields, FormActions } from "@/components/common/form-container";
import { Portal } from "@/components/common/portal";

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
    formState: { errors, isDirty },
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
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200" 
          onClick={updateConfigMutation.isPending ? undefined : onClose} 
          aria-hidden="true" 
        />

        {/* Modal Content */}
        <div className="relative z-50 w-full max-w-lg rounded-xl border border-white/10 bg-background shadow-2xl transition-all duration-200 scale-100 opacity-100">
          <button
            onClick={onClose}
            disabled={updateConfigMutation.isPending}
            className="absolute right-4 top-4 rounded-md p-1.5 text-muted-foreground opacity-70 transition-opacity hover:bg-muted hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-40"
            type="button"
          >
            <X className="h-4.5 w-4.5" />
            <span className="sr-only">Đóng</span>
          </button>

          <FormContainer onSubmit={handleSubmit(onSubmit)} className="p-0">
            <div className="p-6 pb-4 border-b border-white/5">
              <FormHeader 
                title="Cập nhật cấu hình hệ thống" 
                description="Thay đổi giá trị tham số cấu hình. Hãy cẩn trọng vì điều này ảnh hưởng trực tiếp đến logic hoạt động của bãi đỗ xe."
              />
            </div>

            <div className="p-6 pt-5">
              <FormFields className="space-y-5">
                {/* KEY Field */}
                <div className="space-y-2">
                  <Label htmlFor="configKey" className="flex items-center gap-2 text-muted-foreground">
                    Khóa cấu hình (KEY)
                    <ShieldAlert className="h-3.5 w-3.5 text-amber-500/80" />
                  </Label>
                  <div className="flex h-11 w-full items-center rounded-lg border border-dashed border-white/10 bg-white/5 px-3 py-2 text-sm text-muted-foreground/80 cursor-not-allowed">
                    <span className="font-mono text-sm">{config?.configKey || ""}</span>
                  </div>
                  <p className="text-[13px] text-muted-foreground/60">
                    Key cấu hình được bảo vệ bởi hệ thống và không thể thay đổi.
                  </p>
                </div>

                {/* VALUE Field */}
                <div className="space-y-2">
                  <Label htmlFor="configValue" className="text-foreground">
                    Giá trị cấu hình <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="configValue"
                    placeholder="Nhập giá trị cấu hình mới..."
                    {...register("configValue")}
                    className={`h-11 transition-all duration-200 bg-background hover:bg-muted/10 focus-visible:bg-transparent ${
                      errors.configValue ? "border-destructive/80 focus-visible:ring-destructive/30 focus-visible:border-destructive" : "border-border/40 focus-visible:ring-primary/30 focus-visible:border-primary"
                    }`}
                    disabled={updateConfigMutation.isPending}
                  />
                  {errors.configValue && (
                    <p className="text-[13px] font-medium text-destructive mt-1.5 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-destructive"></span>
                      {errors.configValue.message}
                    </p>
                  )}
                </div>

                {/* DESCRIPTION Field */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-foreground">
                    Mô tả <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="description"
                    placeholder="Diễn giải ý nghĩa hoặc hướng dẫn sử dụng cấu hình này..."
                    {...register("description")}
                    className={`h-11 transition-all duration-200 bg-background hover:bg-muted/10 focus-visible:bg-transparent ${
                      errors.description ? "border-destructive/80 focus-visible:ring-destructive/30 focus-visible:border-destructive" : "border-border/40 focus-visible:ring-primary/30 focus-visible:border-primary"
                    }`}
                    disabled={updateConfigMutation.isPending}
                  />
                  {errors.description && (
                    <p className="text-[13px] font-medium text-destructive mt-1.5 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-destructive"></span>
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </FormFields>
            </div>

            <div className="px-6 py-4 border-t border-white/5 bg-muted/20 flex items-center justify-end gap-3 rounded-b-xl">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={updateConfigMutation.isPending}
                className="hover:bg-white/5 transition-colors"
              >
                Hủy bỏ
              </Button>
              <Button 
                type="submit" 
                disabled={updateConfigMutation.isPending || (!isDirty && !updateConfigMutation.isError)}
                className="shadow-sm transition-all duration-200"
              >
                {updateConfigMutation.isPending ? (
                  "Đang xử lý..."
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" /> Lưu thay đổi
                  </>
                )}
              </Button>
            </div>
          </FormContainer>
        </div>
      </div>
    </Portal>
  );
}
