"use client";

import React, { useState } from 'react';
import { PageContainer } from '@/components/common/page-container';
import { PageHeader } from '@/components/common/page-header';
import { Toolbar } from '@/components/common/toolbar';
import { TableSkeleton } from '@/components/common/table-skeleton';
import { EmptyState } from '@/components/common/empty-state';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { SessionFilter } from '@/features/sessions/components/session-filter';
import { SessionTable } from '@/features/sessions/components/session-table';
import { SessionSummaryCards } from '@/features/sessions/components/session-summary-cards';
import { CheckInModal } from '@/features/sessions/components/check-in-modal';
import { useSessionsList } from '@/features/sessions/hooks/use-sessions';

export default function SessionsPage() {
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('ALL');
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);

  const { data, isLoading } = useSessionsList(keyword, status);

  return (
    <PageContainer>
      <PageHeader
        title="Quản Lý Lượt Gửi Xe"
        description="Theo dõi thông tin xe vào/ra bãi, kiểm tra trạng thái và thực hiện check-in cho phương tiện."
        actions={
          <Button onClick={() => setIsCheckInModalOpen(true)}>
            Check-in xe vào
          </Button>
        }
      />
      <Toolbar>
        <SessionFilter
          keyword={keyword}
          onKeywordChange={setKeyword}
          status={status}
          onStatusChange={setStatus}
        />
      </Toolbar>
      
      <SessionSummaryCards />
      
      {isLoading ? (
        <TableSkeleton rows={5} />
      ) : data?.data?.length === 0 ? (
        <EmptyState
          icon={Search}
          title="Không tìm thấy lượt gửi"
          description="Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm biển số xe."
        />
      ) : (
        <SessionTable sessions={data?.data || []} />
      )}

      <CheckInModal
        isOpen={isCheckInModalOpen}
        onClose={() => setIsCheckInModalOpen(false)}
      />
    </PageContainer>
  );
}
