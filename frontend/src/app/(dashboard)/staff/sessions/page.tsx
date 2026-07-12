// ---------------------------------------------
// Parking Sessions Management Page
// Trang quản lý và tra cứu lượt gửi xe cho Staff
// Route: /staff/sessions
// ---------------------------------------------

"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/page-header";
import { PageContainer } from "@/components/common/page-container";
import { Toolbar } from "@/components/common/toolbar";
import { SessionFilter } from "@/features/sessions/components/session-filter";
import { SessionTable } from "@/features/sessions/components/session-table";
import { useSessions } from "@/features/sessions/hooks/use-sessions";

export default function StaffSessionsPage() {
  const [filterParams, setFilterParams] = useState({
    plate: "",
    status: "ALL",
    fromDate: "",
  });

  const { data, isLoading, isError } = useSessions(filterParams);

  const handleFilterChange = (key: string, value: string) => {
    setFilterParams((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <PageContainer>
      {/* Header */}
      <PageHeader
        title="Quản Lý Lượt Gửi Xe"
        description="Theo dõi và tra cứu danh sách các xe đang đỗ hoặc đã rời bãi."
      />

      {/* Bộ lọc */}
      <Toolbar>
        <SessionFilter
          plate={filterParams.plate}
          status={filterParams.status}
          fromDate={filterParams.fromDate}
          onPlateChange={(val) => handleFilterChange("plate", val)}
          onStatusChange={(val) => handleFilterChange("status", val)}
          onFromDateChange={(val) => handleFilterChange("fromDate", val)}
        />
      </Toolbar>

      {/* Bảng dữ liệu */}
      <SessionTable
        sessions={data?.data || []}
        isLoading={isLoading}
      />
    </PageContainer>
  );
}
