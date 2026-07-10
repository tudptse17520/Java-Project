import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  lostTicketSchema,
  LostTicketFormValues,
} from "../schemas/checkout.schema";
import { useCheckoutActions } from "../hooks/use-checkout-actions";
import { CHECKOUT_MESSAGES } from "../constants/session.constants";
import { FormContainer, FormHeader, FormFields, FormActions } from "@/components/common/form-container";

interface LostTicketDialogProps {
  sessionId: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (feeData: any) => void;
}

export function LostTicketDialog({
  sessionId,
  isOpen,
  onClose,
  onSuccess,
}: LostTicketDialogProps) {
  const { lostTicketMutation } = useCheckoutActions();

  const { register, handleSubmit, formState: { errors } } = useForm<LostTicketFormValues>({
    resolver: zodResolver(lostTicketSchema),
    defaultValues: { note: "" },
  });

  const onSubmit = (values: LostTicketFormValues) => {
    lostTicketMutation.mutate(
      {
        sessionId,
        request: {
          note: values.note,
        },
      },
      {
        onSuccess: (data) => {
          toast.success(CHECKOUT_MESSAGES.LOST_TICKET_SUCCESS);
          onSuccess(data);
          onClose();
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || "Lỗi khi báo mất vé");
        },
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div className="relative z-50 w-full max-w-lg rounded-lg border bg-background p-6 shadow-lg">
        <FormContainer onSubmit={handleSubmit(onSubmit)}>
          <FormHeader 
            title="Báo cáo sự cố mất vé"
            description="Hệ thống sẽ tính phí gửi xe cộng thêm tiền phạt mất vé quy định."
          />
          <FormFields>
            <div className="space-y-1">
              <label className="text-sm font-medium leading-none">
                Ghi chú xác minh <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                className={cn(
                  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                  errors.note && "border-destructive focus-visible:ring-destructive"
                )}
                placeholder="VD: Đã đối chiếu CCCD và cavet xe"
                {...register("note")}
              />
              {errors.note && (
                <p className="text-sm text-destructive">{errors.note.message}</p>
              )}
            </div>
          </FormFields>
          <FormActions>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={lostTicketMutation.isPending}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={lostTicketMutation.isPending}>
              {lostTicketMutation.isPending ? "Đang xử lý..." : "Xác nhận báo mất"}
            </Button>
          </FormActions>
        </FormContainer>
      </div>
    </div>
  );
}
