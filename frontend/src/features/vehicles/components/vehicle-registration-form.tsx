"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/stores/auth.store";
import { useRegisterVehicle } from "../hooks/use-register-vehicle";
import { useVehicleTypes } from "../hooks/use-vehicle-types";
import {
  vehicleRegistrationSchema,
  VehicleRegistrationFormValues,
} from "../schemas/vehicle-registration.schema";
import {
  FormContainer,
  FormHeader,
  FormFields,
  FormActions,
} from "@/components/common/form-container";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function VehicleRegistrationForm() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { data: vehicleTypes, isLoading: isLoadingTypes } = useVehicleTypes();
  const { mutate: registerVehicle, isPending } = useRegisterVehicle();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VehicleRegistrationFormValues>({
    resolver: zodResolver(vehicleRegistrationSchema),
    defaultValues: {
      vehicleTypeId: 0,
      plate: "",
      brand: "",
      color: "",
    },
  });

  const onSubmit = (data: VehicleRegistrationFormValues) => {
    setErrorMsg(null);
    registerVehicle(data, {
      onSuccess: () => {
        // Normally show a toast here
        alert("Đăng ký phương tiện thành công!");
        router.push("/vehicles"); // or redirect to vehicle list if exists
      },
      onError: (error: any) => {
        if (error.response?.status === 409) {
          setErrorMsg("Biển số xe này đã được đăng ký trong hệ thống.");
        } else {
          setErrorMsg("Có lỗi xảy ra khi đăng ký phương tiện. Vui lòng thử lại.");
        }
      },
    });
  };

  if (!user) {
    return <div className="p-4 text-center">Vui lòng đăng nhập để tiếp tục.</div>;
  }

  return (
    <FormContainer onSubmit={handleSubmit(onSubmit)} className="max-w-2xl bg-card p-6 rounded-lg border">
      <FormHeader
        title="Đăng ký phương tiện cá nhân"
        description="Vui lòng điền thông tin chi tiết về phương tiện của bạn để đăng ký vào hệ thống."
      />

      {errorMsg && (
        <div className="mb-4 p-3 bg-danger/10 border border-danger text-danger text-sm rounded-md">
          {errorMsg}
        </div>
      )}

      <FormFields>
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Loại xe <span className="text-red-500">*</span>
          </label>
          <select
            {...register("vehicleTypeId", { valueAsNumber: true })}
            className="w-full flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isLoadingTypes}
          >
            <option value={0} disabled>
              -- Chọn loại xe --
            </option>
            {vehicleTypes?.map((vt: any) => (
              <option key={vt.id} value={vt.id}>
                {vt.typeName}
              </option>
            ))}
          </select>
          {errors.vehicleTypeId && (
            <p className="text-sm text-red-500">{errors.vehicleTypeId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Biển số xe <span className="text-red-500">*</span>
          </label>
          <input
            {...register("plate")}
            placeholder="VD: 59X1-123.45"
            className="w-full flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          {errors.plate && (
            <p className="text-sm text-red-500">{errors.plate.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Hãng xe</label>
          <input
            {...register("brand")}
            placeholder="VD: Honda, Toyota..."
            className="w-full flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Màu sắc</label>
          <input
            {...register("color")}
            placeholder="VD: Đen, Trắng..."
            className="w-full flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </FormFields>

      <FormActions>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isPending}
        >
          Hủy bỏ
        </Button>
        <Button type="submit" disabled={isPending || isLoadingTypes}>
          {isPending ? "Đang đăng ký..." : "Đăng ký phương tiện"}
        </Button>
      </FormActions>
    </FormContainer>
  );
}
