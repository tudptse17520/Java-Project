// ---------------------------------------------
// Confirm Dialog
// Modal xác nhận các hành động nguy hiểm (Xóa, Tạm khóa)
// ---------------------------------------------

"use client";

import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Portal } from "@/components/common/portal";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "default";
  isLoading?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Xác nhận",
  description = "Bạn có chắc chắn muốn thực hiện hành động này?",
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  variant = "danger",
  isLoading = false,
}: ConfirmDialogProps) {
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

        {/* Dialog */}
        <div className="relative z-[100] w-full max-w-md rounded-xl border border-border/60 bg-background p-6 shadow-xl animate-scale-in">
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
                variant === "danger" && "bg-rose-500/10 text-rose-600 dark:text-rose-400",
                variant === "warning" && "bg-amber-500/10 text-amber-600 dark:text-amber-400",
                variant === "default" && "bg-primary/10 text-primary"
              )}
            >
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="flex-1 pt-0.5">
              <h3 className="text-base font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              {cancelText}
            </Button>
            <Button
              variant={variant === "danger" ? "destructive" : "default"}
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? "Đang xử lý..." : confirmText}
            </Button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
