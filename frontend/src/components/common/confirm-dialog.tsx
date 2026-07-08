// ---------------------------------------------
// Confirm Dialog
// Modal xác nhận các hành động nguy hiểm (Xóa, Tạm khóa)
// ---------------------------------------------

"use client";

import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="relative z-50 w-full max-w-md rounded-lg border bg-background p-6 shadow-lg">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
              variant === "danger" && "bg-destructive/10 text-destructive",
              variant === "warning" && "bg-yellow-100 text-yellow-600",
              variant === "default" && "bg-primary/10 text-primary"
            )}
          >
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
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
  );
}
