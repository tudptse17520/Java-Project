"use client";

import React, { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { PageContainer } from "@/components/common/page-container";
import { PageHeader } from "@/components/common/page-header";
import { Toolbar } from "@/components/common/toolbar";
import { SearchInput } from "@/components/common/search-input";
import { EmptyState } from "@/components/common/empty-state";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { useBrowseBuildings } from "../hooks/use-browse-buildings";
import { useSlotAvailabilityStream } from "../hooks/use-slot-availability-stream";
import { BuildingCard } from "./building-card";
import { BuildingDetailDialog } from "./building-detail-dialog";
import { BROWSE_BUILDING_KEYS } from "../constants/browse-building.constants";
import type { BuildingBrowseItem } from "../types/browse-building.type";
import { BuildingStatus } from "@/constants/building-status";

export function BrowseBuildingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBuildingId, setSelectedBuildingId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data: buildings, isLoading, error } = useBrowseBuildings();

  // Subscribe to global SSE for updates to all buildings on this page
  useSlotAvailabilityStream({
    onEvent: (event) => {
      queryClient.setQueryData<BuildingBrowseItem[]>(
        BROWSE_BUILDING_KEYS.lists(),
        (oldData) => {
          if (!oldData) return oldData;
          return oldData.map((b) => {
            if (b.id === event.building_id) {
              return { ...b, available_slots: event.building_available_slots };
            }
            return b;
          });
        }
      );
    }
  });

  const filteredBuildings = useMemo(() => {
    if (!buildings) return [];
    
    // Sort logic: ACTIVE buildings first, then others
    const sorted = [...buildings].sort((a, b) => {
      if (a.status === BuildingStatus.ACTIVE && b.status !== BuildingStatus.ACTIVE) return -1;
      if (a.status !== BuildingStatus.ACTIVE && b.status === BuildingStatus.ACTIVE) return 1;
      return a.building_name.localeCompare(b.building_name);
    });

    if (!searchQuery.trim()) return sorted;

    const lowerQuery = searchQuery.toLowerCase();
    return sorted.filter((b) => 
      b.building_name.toLowerCase().includes(lowerQuery) ||
      b.address.toLowerCase().includes(lowerQuery)
    );
  }, [buildings, searchQuery]);

  return (
    <PageContainer>
      <PageHeader 
        title="Tìm bãi đỗ xe" 
        description="Xem danh sách tòa nhà và trạng thái chỗ trống theo thời gian thực."
      />
      
      <Toolbar>
        <div className="w-full sm:w-96">
          <SearchInput
            placeholder="Tìm theo tên hoặc địa chỉ..."
            onSearch={setSearchQuery}
          />
        </div>
      </Toolbar>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner text="Đang tải danh sách tòa nhà..." />
        </div>
      ) : error || !buildings ? (
        <EmptyState 
          title="Không thể tải dữ liệu" 
          description="Đã xảy ra lỗi khi kết nối tới máy chủ. Vui lòng thử lại sau."
        />
      ) : filteredBuildings.length === 0 ? (
        <EmptyState 
          title="Không tìm thấy kết quả" 
          description={`Không có bãi đỗ xe nào khớp với "${searchQuery}".`}
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBuildings.map((building) => (
            <BuildingCard 
              key={building.id} 
              building={building} 
              onClick={setSelectedBuildingId} 
            />
          ))}
        </div>
      )}

      {/* Detail Dialog */}
      {selectedBuildingId !== null && (
        <BuildingDetailDialog 
          buildingId={selectedBuildingId} 
          onClose={() => setSelectedBuildingId(null)} 
        />
      )}
    </PageContainer>
  );
}
