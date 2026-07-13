"use client";

import { useState } from 'react';
import { Plus, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageContainer } from '@/components/common/page-container';
import { PageHeader } from '@/components/common/page-header';
import { Toolbar } from '@/components/common/toolbar';
import { useSlots, useCreateSlot } from '@/features/slots/hooks/use-slots';
import { SlotTable } from '@/features/slots/components/slot-table';
import { SlotGrid } from '@/features/slots/components/slot-grid';
import { SlotFilter } from '@/features/slots/components/slot-filter';
import { SlotStats } from '@/features/slots/components/slot-stats';
import { SlotFormDialog } from '@/features/slots/components/slot-form-dialog';
import type { SlotFormValues } from '@/features/slots/schemas/slot.schema';

type ViewMode = 'list' | 'grid';

export default function ManageSlotsPage() {
  const [keyword, setKeyword] = useState<string>('');
  const [floorId, setFloorId] = useState<number | undefined>(undefined);
  const [status, setStatus] = useState<string>('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const { data, isLoading } = useSlots(floorId, status || undefined);
  const createMutation = useCreateSlot();

  const handleFormSubmit = (values: SlotFormValues) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        setIsFormOpen(false);
      },
    });
  };

  // Filter data by keyword on client side if backend doesn't support it yet
  const filteredData = data?.data?.filter(slot => 
    !keyword || slot.slotName.toLowerCase().includes(keyword.toLowerCase())
  ) ?? [];

  return (
    <PageContainer>
      <PageHeader 
        title="Quản lý vị trí đỗ" 
        description="Quản lý danh sách, trạng thái và thiết lập vị trí đỗ xe trong bãi"
        actions={
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm vị trí
          </Button>
        }
      />
      
      <SlotStats />

      <Toolbar className="flex justify-between items-center w-full">
        <SlotFilter 
          keyword={keyword}
          floorId={floorId}
          status={status}
          onKeywordChange={setKeyword}
          onFloorIdChange={setFloorId}
          onStatusChange={setStatus}
        />
        <div className="flex items-center bg-muted/50 p-1 rounded-md border ml-auto">
          <Button
            variant={viewMode === 'list' ? "secondary" : "ghost"}
            size="sm"
            className={`h-8 px-3 ${viewMode === 'list' ? 'shadow-sm bg-background' : ''}`}
            onClick={() => setViewMode('list')}
            title="Chế độ Danh sách"
          >
            <List className="h-4 w-4 mr-2" />
            Danh sách
          </Button>
          <Button
            variant={viewMode === 'grid' ? "secondary" : "ghost"}
            size="sm"
            className={`h-8 px-3 ${viewMode === 'grid' ? 'shadow-sm bg-background' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Chế độ Sơ đồ (Lưới)"
          >
            <LayoutGrid className="h-4 w-4 mr-2" />
            Lưới
          </Button>
        </div>
      </Toolbar>
      
      <div className="mt-4">
        {viewMode === 'list' ? (
          <SlotTable data={filteredData} isLoading={isLoading} />
        ) : (
          <SlotGrid data={filteredData} isLoading={isLoading} />
        )}
      </div>

      <SlotFormDialog 
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        isLoading={createMutation.isPending}
      />
    </PageContainer>
  );
}