"use client";

import { useQuery } from "@tanstack/react-query";
import { getPricingPolicies } from "@/services/pricing-policy.service";
import axiosClient from "@/lib/axios-client";
import { formatCurrency } from "@/utils/format-currency";
import { Banknote } from "lucide-react";

interface SimpleVehicleType {
  id: number;
  typeName: string;
}

export function PricingSummary() {
  const { data: policies, isLoading: isLoadingPolicies } = useQuery({
    queryKey: ["pricing-policies-browse"],
    queryFn: () => getPricingPolicies(),
  });

  // Fetch vehicle types directly without calling /reports/occupancy (which requires MANAGER/ADMIN role)
  const { data: vehicleTypes, isLoading: isLoadingTypes } = useQuery<SimpleVehicleType[]>({
    queryKey: ["vehicle-types-browse"],
    queryFn: async () => {
      const res = await axiosClient.get<SimpleVehicleType[]>("/vehicle-types");
      return res.data;
    },
  });

  if (isLoadingPolicies || isLoadingTypes) {
    return (
      <div className="animate-pulse space-y-2">
        <div className="h-4 w-24 rounded bg-muted" />
        <div className="h-12 rounded bg-muted" />
      </div>
    );
  }

  if (!policies || policies.length === 0) {
    return null;
  }

  return (
    <div>
      <h4 className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
        <Banknote className="h-4 w-4" />
        Bảng giá tham khảo
      </h4>
      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <th className="px-4 py-2.5">Loại xe</th>
              <th className="px-4 py-2.5 text-right">Giá cơ bản</th>
              <th className="px-4 py-2.5 text-right">Phụ thu/giờ</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {policies.map((policy: any) => {
              const typeName = vehicleTypes?.find((vt: SimpleVehicleType) => vt.id === policy.vehicleTypeId)?.typeName;
              return (
                <tr key={policy.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-2.5 font-medium">
                    {typeName || policy.vehicleTypeName || `Loại ${policy.vehicleTypeId}`}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums font-semibold text-primary">
                    {formatCurrency(policy.basePrice)}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">
                    {formatCurrency(policy.extraFeePerHour)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
