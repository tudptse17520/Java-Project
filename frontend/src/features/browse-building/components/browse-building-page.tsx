"use client";

import React, { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Filter } from "lucide-react";
import { PageContainer } from "@/components/common/page-container";
import { PageHeader } from "@/components/common/page-header";
import { Toolbar } from "@/components/common/toolbar";
import { SearchInput } from "@/components/common/search-input";
import { EmptyState } from "@/components/common/empty-state";
import { useBrowseBuildings } from "../hooks/use-browse-buildings";
import { useSlotAvailabilityStream } from "../hooks/use-slot-availability-stream";
import { BuildingCard } from "./building-card";
import { BuildingDetailDialog } from "./building-detail-dialog";
import { ActiveSessionCard } from "@/features/sessions/components/active-session-card";
import { BROWSE_BUILDING_KEYS } from "../constants/browse-building.constants";
import type { BuildingBrowseItem } from "../types/browse-building.type";
import { BuildingStatus } from "@/constants/building-status";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

function BuildingCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border/40 bg-card p-5 h-[260px] shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <Skeleton className="h-6 w-3/4 rounded-md" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full rounded-md mb-6" />
      <div className="flex gap-2 mb-6">
        <Skeleton className="h-6 w-16 rounded-md" />
        <Skeleton className="h-6 w-16 rounded-md" />
      </div>
      <div className="grid grid-cols-2 gap-y-4 mb-4">
        <Skeleton className="h-4 w-20 rounded-md" />
        <Skeleton className="h-4 w-24 rounded-md" />
        <Skeleton className="h-6 w-28 rounded-md col-span-2" />
      </div>
      <div className="mt-auto pt-2">
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
    </div>
  );
}

export function BrowseBuildingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
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
              return { ...b, availableSlots: event.building_available_slots };
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
    let sorted = [...buildings].sort((a, b) => {
      if (a.status === BuildingStatus.ACTIVE && b.status !== BuildingStatus.ACTIVE) return -1;
      if (a.status !== BuildingStatus.ACTIVE && b.status === BuildingStatus.ACTIVE) return 1;
      return (a.buildingName || "").localeCompare(b.buildingName || "");
    });

    // Apply mock filters
    if (activeFilter === "available") {
      sorted = sorted.filter(b => b.availableSlots > 0);
    }

    if (!searchQuery.trim()) return sorted;

    const lowerQuery = searchQuery.toLowerCase();
    return sorted.filter((b) => 
      (b.buildingName || "").toLowerCase().includes(lowerQuery) ||
      (b.address || "").toLowerCase().includes(lowerQuery)
    );
  }, [buildings, searchQuery, activeFilter]);

  return (
    <PageContainer>
      <PageHeader 
        title="Tìm bãi đỗ xe" 
        description="Xem danh sách tòa nhà và trạng thái chỗ trống theo thời gian thực."
      />
      
      <ActiveSessionCard />

      <Toolbar>
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <div className="w-full sm:max-w-md">
            <SearchInput
              placeholder="Tìm theo tên hoặc địa chỉ..."
              onSearch={setSearchQuery}
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
            <Button 
              variant={activeFilter === "all" ? "default" : "outline"} 
              className="h-10 rounded-xl text-sm font-medium whitespace-nowrap"
              onClick={() => setActiveFilter("all")}
            >
              Tất cả
            </Button>
            <Button 
              variant={activeFilter === "car" ? "default" : "outline"} 
              className="h-10 rounded-xl text-sm font-medium whitespace-nowrap"
              onClick={() => setActiveFilter("car")}
            >
              🚗 Ô tô
            </Button>
            <Button 
              variant={activeFilter === "bike" ? "default" : "outline"} 
              className="h-10 rounded-xl text-sm font-medium whitespace-nowrap"
              onClick={() => setActiveFilter("bike")}
            >
              🏍 Xe máy
            </Button>
            <Button 
              variant={activeFilter === "available" ? "default" : "outline"} 
              className="h-10 rounded-xl text-sm font-medium whitespace-nowrap"
              onClick={() => setActiveFilter("available")}
            >
              🟢 Có chỗ trống
            </Button>
            
            <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0 rounded-xl ml-auto border border-border/40 sm:hidden">
              <Filter className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </Toolbar>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => <BuildingCardSkeleton key={i} />)}
        </div>
      ) : error || !buildings ? (
        <EmptyState 
          title="Không thể tải dữ liệu" 
          description="Đã xảy ra lỗi khi kết nối tới máy chủ. Vui lòng thử lại sau."
        />
      ) : filteredBuildings.length === 0 ? (
        <EmptyState 
          title="Không tìm thấy kết quả" 
          description={
            activeFilter !== "all" 
              ? "Không có bãi đỗ xe nào khớp với bộ lọc hiện tại."
              : `Không có bãi đỗ xe nào khớp với "${searchQuery}".`
          }
          action={
            <Button variant="outline" onClick={() => { setSearchQuery(""); setActiveFilter("all"); }}>
              Xóa bộ lọc
            </Button>
          }
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
