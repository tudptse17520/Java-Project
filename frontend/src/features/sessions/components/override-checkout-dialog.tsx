import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  overrideCheckoutSchema,
  OverrideCheckoutFormValues,
} from "../schemas/checkout.schema";
import { useCheckoutActions } from "../hooks/use-checkout-actions";
import { CHECKOUT_MESSAGES } from "../constants/session.constants";
import { FormContainer, FormHeader, FormFields, FormActions } from "@/components/common/form-container";

interface OverrideCheckoutDialogProps {
  sessionId: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function OverrideCheckoutDialog({
  sessionId,
  isOpen,
  onClose,
  onSuccess,
}: OverrideCheckoutDialogProps) {
  const { overrideCheckoutMutation } = useCheckoutActions();

  const { register, handleSubmit, formState: { errors } } = useForm<OverrideCheckoutFormValues>({
    resolver: zodResolver(overrideCheckoutSchema),
    defaultValues: { overrideReason: "" },
  });

  const onSubmit = (values: OverrideCheckoutFormValues) => {
    overrideCheckoutMutation.mutate(
      {
        sessionId,
        request: {
          overrideReason: values.overrideReason,
        },
      },
      {
        onSuccess: () => {
          toast.success(CHECKOUT_MESSAGES.OVERRIDE_SUCCESS);
          onSuccess();
          onClose();
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || "Lỗi khi ghi đè");
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
            title="Ghi đè lỗi sai biển số"
            description="Xác nhận xe được phép ra bãi dù biển số không khớp. Hành động này sẽ được ghi lại trong hệ thống."
          />
          <FormFields>
            <div className="space-y-1">
              <label className="text-sm font-medium leading-none">
                Lý do ghi đè <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                className={cn(
                  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                  errors.overrideReason && "border-destructive focus-visible:ring-destructive"
                )}
                placeholder="VD: Đã kiểm tra giấy tờ xe hợp lệ"
                {...register("overrideReason")}
              />
              {errors.overrideReason && (
                <p className="text-sm text-destructive">{errors.overrideReason.message}</p>
              )}
            </div>
          </FormFields>
          <FormActions>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={overrideCheckoutMutation.isPending}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={overrideCheckoutMutation.isPending}>
              {overrideCheckoutMutation.isPending ? "Đang xử lý..." : "Xác nhận"}
            </Button>
          </FormActions>
        </FormContainer>
      </div>
    </div>
  );
}
