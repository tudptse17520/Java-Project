import React, { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/common/data-table';
import { SessionResponse } from '@/types/session.type';
import { SessionStatusBadge } from './session-status-badge';
import dayjs from 'dayjs';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { useUpdateSessionStatus } from '../hooks/use-sessions';
import { Eye, LogOut, Printer, ArrowUpDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
interface SessionTableProps {
  sessions: SessionResponse[];
  isLoading?: boolean;
}

export const SessionTable = ({ sessions, isLoading }: SessionTableProps) => {
  const updateStatusMutation = useUpdateSessionStatus();
  const router = useRouter();
  
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const [actionType, setActionType] = useState<string>('');

  // Hàm sinh dữ liệu mock cho các cột còn thiếu trên Backend
  const getMockData = (id: number) => {
    const floors = ['Tầng 1', 'Tầng 2', 'Tầng 3'];
    const types = ['Ô tô', 'Xe máy'];
    return {
      floor: floors[id % floors.length],
      slot: `${['A','B','C'][id % 3]}-${(id % 20) + 1}`,
      type: types[id % types.length]
    };
  };

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
      cell: ({ row }) => <span className="font-medium text-muted-foreground">#{row.original.id}</span>
    },
    {
      accessorKey: 'plate',
      header: ({ column }) => (
        <Button variant="ghost" className="-ml-4 h-8 data-[state=open]:bg-accent font-semibold text-xs uppercase" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Biển số
          <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
        </Button>
      ),
      cell: ({ row }) => <span className="font-bold text-primary text-base">{row.original.plate}</span>
    },
    {
      accessorKey: 'ticketCode',
      header: 'Mã vé',
      cell: ({ row }) => <span className="font-medium">{row.original.ticketCode || '—'}</span>
    },
    {
      accessorKey: 'timeIn',
      header: ({ column }) => (
        <Button variant="ghost" className="-ml-4 h-8 data-[state=open]:bg-accent font-semibold text-xs uppercase" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Giờ vào
          <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
        </Button>
      ),
      cell: ({ row }) => <span className="font-medium">{dayjs(row.getValue('timeIn')).format('DD/MM/YYYY HH:mm')}</span>
    },
    {
      id: 'location',
      header: 'Khu vực',
      cell: ({ row }) => {
        const mock = getMockData(row.original.id);
        return (
          <div className="flex flex-col">
            <span className="font-medium">{mock.floor}</span>
            <span className="text-xs text-muted-foreground">{mock.slot}</span>
          </div>
        );
      }
    },
    {
      id: 'vehicleType',
      header: 'Loại xe',
      cell: ({ row }) => <span className="text-muted-foreground">{getMockData(row.original.id).type}</span>
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
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger render={<Button size="icon" className="h-8 w-8" variant="ghost" />}>
                <Eye className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent>Xem chi tiết</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger render={<Button size="icon" className="h-8 w-8" variant="ghost" />}>
                <Printer className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent>In mã vé</TooltipContent>
            </Tooltip>
            
            {session.status === 'IN_PROGRESS' && (
              <Tooltip>
                <TooltipTrigger render={<Button size="icon" className="h-8 w-8" variant="ghost" onClick={() => router.push('/staff/check-out')} />}>
                  <LogOut className="h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent>Cho xe ra (Check-out)</TooltipContent>
              </Tooltip>
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
