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

import { Feedback } from "../types/feedback.type";
import { feedbackFormSchema, FeedbackFormValues } from "../schemas/feedback.schema";
import { useFeedbackActions } from "../hooks/use-feedback-actions";

interface FeedbackFormDialogProps {
  feedback: Feedback | null;
  isOpen: boolean;
  onClose: () => void;
  readOnly?: boolean;
}

export function FeedbackFormDialog({
  feedback,
  isOpen,
  onClose,
  readOnly = false,
}: FeedbackFormDialogProps) {
  const { createFeedbackMutation, updateFeedbackMutation } = useFeedbackActions();
  const isEditing = !!feedback;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      parkingSessionId: 0,
      issueType: "LOST_TICKET",
      description: "",
      status: "REPORTED",
    },
  });

  useEffect(() => {
    if (feedback && isOpen) {
      reset({
        parkingSessionId: feedback.parkingSessionId,
        issueType: feedback.issueType,
        description: feedback.description,
        status: feedback.status,
      });
    } else if (!isOpen) {
      reset({
        parkingSessionId: 0,
        issueType: "LOST_TICKET",
        description: "",
        status: "REPORTED",
      });
    }
  }, [feedback, isOpen, reset]);

  const onSubmit = (values: FeedbackFormValues) => {
    if (readOnly) {
      onClose();
      return;
    }

    if (isEditing) {
      updateFeedbackMutation.mutate(
        { id: feedback.id, request: values },
        {
          onSuccess: () => {
            toast.success("Cập nhật sự cố thành công");
            onClose();
          },
          onError: (error: any) => {
            toast.error(error.response?.data?.message || "Lỗi khi cập nhật");
          },
        }
      );
    } else {
      createFeedbackMutation.mutate(values, {
        onSuccess: () => {
          toast.success("Ghi nhận sự cố thành công");
          onClose();
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || "Lỗi khi tạo sự cố");
        },
      });
    }
  };

  const isPending = createFeedbackMutation.isPending || updateFeedbackMutation.isPending;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity" 
        onClick={onClose} 
        aria-hidden="true" 
      />

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
            title={readOnly ? "Chi tiết sự cố" : isEditing ? "Cập nhật sự cố" : "Ghi nhận sự cố mới"} 
            description={readOnly ? "Xem thông tin báo cáo sự cố." : "Điền thông tin để báo cáo hệ thống."}
          />

          <FormFields>
            <div className="space-y-2">
              <Label htmlFor="parkingSessionId">ID Lượt gửi xe <span className="text-destructive">*</span></Label>
              <Input
                id="parkingSessionId"
                type="number"
                placeholder="Ví dụ: 123"
                {...register("parkingSessionId", { valueAsNumber: true })}
                className={errors.parkingSessionId ? "border-destructive focus-visible:ring-destructive" : ""}
                disabled={isPending || readOnly || isEditing}
              />
              {errors.parkingSessionId && (
                <p className="text-sm text-destructive">{errors.parkingSessionId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="issueType">Loại sự cố <span className="text-destructive">*</span></Label>
              <select
                id="issueType"
                {...register("issueType")}
                disabled={isPending || readOnly || isEditing}
                className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.issueType ? "border-destructive" : ""}`}
              >
                <option value="LOST_TICKET">Mất thẻ</option>
                <option value="WRONG_PLATE">Sai biển số</option>
                <option value="OVERTIME">Quá giờ</option>
                <option value="WRONG_PLACE">Đỗ sai vị trí</option>
                <option value="UNPAID_EXIT">Chưa thanh toán</option>
              </select>
              {errors.issueType && (
                <p className="text-sm text-destructive">{errors.issueType.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả chi tiết <span className="text-destructive">*</span></Label>
              <Input
                id="description"
                placeholder="Nhập mô tả sự cố..."
                {...register("description")}
                className={errors.description ? "border-destructive focus-visible:ring-destructive" : ""}
                disabled={isPending || readOnly}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái xử lý <span className="text-destructive">*</span></Label>
              <select
                id="status"
                {...register("status")}
                disabled={isPending || readOnly}
                className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.status ? "border-destructive" : ""}`}
              >
                <option value="REPORTED">Đã ghi nhận</option>
                <option value="PROCESSING">Đang xử lý</option>
                <option value="RESOLVED">Đã giải quyết</option>
              </select>
              {errors.status && (
                <p className="text-sm text-destructive">{errors.status.message}</p>
              )}
            </div>
          </FormFields>

          <FormActions>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              {readOnly ? "Đóng" : "Hủy"}
            </Button>
            {!readOnly && (
              <Button type="submit" disabled={isPending}>
                {isPending ? "Đang xử lý..." : "Lưu thay đổi"}
              </Button>
            )}
          </FormActions>
        </FormContainer>
      </div>
    </div>
  );
}
