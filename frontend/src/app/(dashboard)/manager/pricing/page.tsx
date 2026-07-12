// ---------------------------------------------
// Pricing Policy Management Page
// Trang quản lý bảng giá cho Parking Manager
// Route: /manager/pricing
// ---------------------------------------------

"use client";

import React from "react";
import { PageHeader } from "@/components/common/page-header";
import { PageContainer } from "@/components/common/page-container";
import { Toolbar } from "@/components/common/toolbar";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { Plus } from "lucide-react";
import {
  usePricingPolicies,
  useVehicleTypesForFilter,
} from "@/features/pricing-policies/hooks/use-pricing-policies";
import { usePricingPolicyActions } from "@/features/pricing-policies/hooks/use-pricing-policy-actions";

import { PricingPolicyTable } from "@/features/pricing-policies/components/pricing-policy-table";
import { PricingPolicyFormDialog } from "@/features/pricing-policies/components/pricing-policy-form-dialog";
import { PricingPolicyFilter } from "@/features/pricing-policies/components/pricing-policy-filter";

export default function PricingPolicyPage() {
  // Hook Action: quản lý trạng thái UI (form, dialog, filter)
  const {
    isFormOpen,
    selectedPolicy,
    isMutating,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseForm,
    handleFormSubmit,
    isConfirmOpen,
    policyToDelete,
    isDeleting,
    handleOpenDelete,
    handleCloseConfirm,
    handleConfirmDelete,
    filterVehicleTypeId,
    handleFilterChange,
  } = usePricingPolicyActions();

  // Hook Data: lấy danh sách bảng giá (có filter)
  const { data: rawPricingPolicies = [], isLoading } =
    usePricingPolicies(filterVehicleTypeId);

  // Hook Data: lấy danh sách loại xe cho dropdown
  const { data: vehicleTypes = [], isLoading: isLoadingVehicleTypes } =
    useVehicleTypesForFilter();

  // Ánh xạ tên loại xe vào danh sách bảng giá
  const pricingPolicies = React.useMemo(() => {
    return rawPricingPolicies.map(policy => {
      const vt = vehicleTypes.find(v => v.id === policy.vehicle_type_id);
      return {
        ...policy,
        vehicle_type_name: vt ? vt.typeName : policy.vehicle_type_name
      };
    });
  }, [rawPricingPolicies, vehicleTypes]);

  return (
    <PageContainer>
      {/* Header */}
      <PageHeader
        title="Quản lý bảng giá"
        description="Thiết lập và quản lý chính sách giá cho từng loại phương tiện."
        actions={
          <Button onClick={handleOpenCreate}>
            <Plus className="mr-1 h-4 w-4" />
            Thêm bảng giá
          </Button>
        }
      />

      {/* Filter */}
      <Toolbar>
        <PricingPolicyFilter
          vehicleTypes={vehicleTypes}
          isLoading={isLoadingVehicleTypes}
          value={filterVehicleTypeId}
          onChange={handleFilterChange}
        />
      </Toolbar>

      {/* Table */}
      <PricingPolicyTable
        data={pricingPolicies}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      {/* Form Dialog (Thêm / Sửa) */}
      <PricingPolicyFormDialog
        open={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        defaultValues={selectedPolicy}
        isLoading={isMutating}
        vehicleTypes={vehicleTypes}
        isLoadingVehicleTypes={isLoadingVehicleTypes}
      />

      {/* Confirm Dialog (Xóa) */}
      <ConfirmDialog
        open={isConfirmOpen}
        onClose={handleCloseConfirm}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa bảng giá"
        description={
          policyToDelete
            ? `Bạn có chắc chắn muốn xóa bảng giá ID ${policyToDelete.id}? Hành động này không thể hoàn tác.`
            : ""
        }
        confirmText="Xóa"
        variant="danger"
        isLoading={isDeleting}
      />
    </PageContainer>
  );
}
