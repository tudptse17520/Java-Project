"use client";

import { useState } from "react";
import { PageContainer } from "@/components/layouts/page-container";
import { PageHeader } from "@/components/layouts/page-header";
import { ConfigTable } from "@/features/system-configs/components/config-table";
import { ConfigFilter } from "@/features/system-configs/components/config-filter";
import { ConfigFormDialog } from "@/features/system-configs/components/config-form-dialog";
import { useConfigs } from "@/features/system-configs/hooks/use-configs";
import { SystemConfig } from "@/features/system-configs/types/config.type";

export default function SettingsPage() {
  const [keyword, setKeyword] = useState("");
  const [selectedConfig, setSelectedConfig] = useState<SystemConfig | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: configData, isLoading } = useConfigs({ keyword });

  const handleEdit = (config: SystemConfig) => {
    setSelectedConfig(config);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedConfig(null);
  };

  return (
    <PageContainer>
      <PageHeader
        title="Cấu hình hệ thống"
        description="Quản lý và cập nhật các tham số cấu hình của hệ thống bãi đỗ xe."
      />

      <div className="space-y-4 mt-6">
        <ConfigFilter onSearch={setKeyword} isLoading={isLoading} />
        
        <ConfigTable
          data={configData?.data || []}
          isLoading={isLoading}
          onEdit={handleEdit}
        />
      </div>

      <ConfigFormDialog
        config={selectedConfig}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
      />
    </PageContainer>
  );
}
