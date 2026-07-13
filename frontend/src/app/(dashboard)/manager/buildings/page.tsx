"use client";

import React, { useState } from 'react';
import { PageContainer } from '@/components/common/page-container';
import { PageHeader } from '@/components/common/page-header';
import { Toolbar } from '@/components/common/toolbar';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { BuildingFilter } from '@/features/buildings/components/building-filter';
import { BuildingTable } from '@/features/buildings/components/building-table';
import { BuildingModal } from '@/features/buildings/components/building-modal';
import { BuildingStats } from '@/features/buildings/components/building-stats';
import { useBuildings } from '@/features/buildings/hooks/use-buildings';
import { TableSkeleton } from '@/components/common/table-skeleton';
import { EmptyState } from '@/components/common/empty-state';
import type { BuildingResponse } from '@/types/building.type';

export default function BuildingsPage() {
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('ALL');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingResponse | null>(null);

  const { data, isLoading } = useBuildings(keyword, status);

  const handleAddBuilding = () => {
    setSelectedBuilding(null);
    setIsModalOpen(true);
  };

  const handleEditBuilding = (building: BuildingResponse) => {
    setSelectedBuilding(building);
    setIsModalOpen(true);
  };

  return (
    <PageContainer>
      <PageHeader 
        title="Quản Lý Tòa Nhà" 
        description="Quản lý thông tin cấu trúc bãi xe, hạ tầng phân khu và theo dõi trạng thái vận hành của từng tòa nhà." 
        actions={
          <Button onClick={handleAddBuilding}>
            Thêm tòa nhà
          </Button>
        } 
      />
      
      <BuildingStats />

      <Toolbar>
        <BuildingFilter 
          keyword={keyword}
          status={status}
          onKeywordChange={setKeyword}
          onStatusChange={setStatus}
        />
      </Toolbar>
      
      {isLoading ? (
        <TableSkeleton rows={5} />
      ) : (!data?.data || data.data.length === 0) ? (
        <EmptyState 
          title="Không tìm thấy tòa nhà" 
          description="Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm tòa nhà." 
          icon={Search}
        />
      ) : (
        <BuildingTable 
          buildings={data.data} 
          onEdit={handleEditBuilding}
        />
      )}

      <BuildingModal 
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        building={selectedBuilding}
      />
    </PageContainer>
  );
}
