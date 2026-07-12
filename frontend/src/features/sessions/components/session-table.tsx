import React, { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/common/data-table';
import { SessionResponse } from '@/types/session.type';
import { SessionStatusBadge } from './session-status-badge';
import dayjs from 'dayjs';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { useUpdateSessionStatus } from '../hooks/use-sessions';

interface SessionTableProps {
  sessions: SessionResponse[];
  isLoading?: boolean;
}

export const SessionTable = ({ sessions, isLoading }: SessionTableProps) => {
  const updateStatusMutation = useUpdateSessionStatus();
  
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const [actionType, setActionType] = useState<string>('');

  const handleAction = (id: number, type: string) => {
    setSelectedSessionId(id);
    setActionType(type);
    setConfirmOpen(true);
  };

  const onConfirm = () => {
    if (selectedSessionId !== null && actionType) {
      updateStatusMutation.mutate({ id: selectedSessionId, status: actionType }, {
        onSuccess: () => setConfirmOpen(false)
      });
    }
  };

  const columns: ColumnDef<SessionResponse>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'plate',
      header: 'Biển số',
    },
    {
      accessorKey: 'ticketCode',
      header: 'Mã vé',
    },
    {
      accessorKey: 'timeIn',
      header: 'Giờ vào',
      cell: ({ row }) => dayjs(row.getValue('timeIn')).format('DD/MM/YYYY HH:mm')
    },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      cell: ({ row }) => <SessionStatusBadge status={row.getValue('status')} />
    },
    {
      id: 'actions',
      header: 'Thao tác',
      cell: ({ row }) => {
        const session = row.original;
        return (
          <div className="flex gap-2">
            {session.status === 'IN_PROGRESS' && (
              <Button size="sm" variant="outline" onClick={() => handleAction(session.id, 'COMPLETED')}>
                Cho xe ra
              </Button>
            )}
          </div>
        );
      }
    }
  ];

  return (
    <>
      <div className="overflow-x-auto w-full">
        <DataTable columns={columns} data={sessions} isLoading={isLoading} />
      </div>
      <ConfirmDialog 
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={onConfirm}
        title="Xác nhận"
        description="Bạn có chắc chắn muốn thực hiện hành động này?"
        isLoading={updateStatusMutation.isPending}
      />
    </>
  );
};
