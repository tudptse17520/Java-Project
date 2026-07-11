"use client";

import { PageContainer } from '@/components/common/page-container';
import { PageHeader } from '@/components/common/page-header';
import { Toolbar } from '@/components/common/toolbar';
import { DataTable } from '@/components/common/data-table';
import { useSlots } from '@/features/slots/hooks/use-slots';

export default function ManageSlotsPage() {
  const { data, isLoading } = useSlots();

  return (
    <PageContainer>
      <PageHeader 
        title="Quản lý vị trí đỗ" 
        description="Danh sách và trạng thái các vị trí đỗ xe trong bãi"
      />
      <Toolbar>
        {/* Các thành phần Tìm kiếm / Bộ lọc đặt ở đây */}
        <div></div> 
      </Toolbar>
      <DataTable 
        data={data?.data ?? []} 
        columns={[
          { header: 'Mã vị trí', accessorKey: 'slotName' },
          { header: 'Trạng thái', accessorKey: 'status' }
        ]} 
        isLoading={isLoading} 
      />
    </PageContainer>
  );
}