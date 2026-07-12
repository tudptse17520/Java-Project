"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cập nhật Cấu hình</DialogTitle>
          <DialogDescription>
            Thay đổi giá trị của cấu hình hệ thống.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
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
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <DialogFooter className="pt-4">
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
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
