"use client";

import { useState } from "react";
import { PageContainer } from "@/components/common/page-container";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { VehicleRegistrationForm } from "@/features/vehicles/components/vehicle-registration-form";
import { VehicleList } from "@/features/vehicles/components/vehicle-list";

export default function VehiclesPage() {
  const [isAdding, setIsAdding] = useState(false);

  return (
    <PageContainer>
      <PageHeader
        title="Phương tiện cá nhân"
        description="Quản lý danh sách phương tiện của bạn."
        actions={
          !isAdding && (
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="mr-2 h-4 w-4" /> Đăng ký xe mới
            </Button>
          )
        }
      />

      <div className="mt-6">
        {isAdding ? (
          <div className="mx-auto w-full max-w-2xl">
            <VehicleRegistrationForm 
              onCancel={() => setIsAdding(false)}
              onSuccessCallback={() => setIsAdding(false)}
            />
          </div>
        ) : (
          <VehicleList onAddClick={() => setIsAdding(true)} />
        )}
      </div>
    </PageContainer>
  );
}
