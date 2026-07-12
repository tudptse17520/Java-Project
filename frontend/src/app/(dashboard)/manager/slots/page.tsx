"use client";

import { useState } from 'react';
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageContainer } from '@/components/common/page-container';
import { PageHeader } from '@/components/common/page-header';
import { Toolbar } from '@/components/common/toolbar';
import { useSlots, useCreateSlot } from '@/features/slots/hooks/use-slots';
import { SlotTable } from '@/features/slots/components/slot-table';
import { SlotFilter } from '@/features/slots/components/slot-filter';
import { SlotFormDialog } from '@/features/slots/components/slot-form-dialog';
import type { SlotFormValues } from '@/features/slots/schemas/slot.schema';

export default function ManageSlotsPage() {
  const [floorId, setFloorId] = useState<number | undefined>(undefined);
  const [status, setStatus] = useState<string>('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data, isLoading } = useSlots(floorId, status || undefined);
  const createMutation = useCreateSlot();

  const handleFormSubmit = (values: SlotFormValues) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        setIsFormOpen(false);
      },
    });
  };

  return (
    <PageContainer>
      <PageHeader 
        title="Quản lý vị trí đỗ" 
        description="Danh sách và trạng thái các vị trí đỗ xe trong bãi"
        actions={
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm vị trí
          </Button>
        }
      />
      <Toolbar>
        <SlotFilter 
          floorId={floorId}
          status={status}
          onFloorIdChange={setFloorId}
          onStatusChange={setStatus}
        />
      </Toolbar>
      
      <div className="mt-4">
        <SlotTable data={data?.data ?? []} isLoading={isLoading} />
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