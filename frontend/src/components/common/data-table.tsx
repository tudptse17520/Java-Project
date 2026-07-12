// ---------------------------------------------
// Data Table
// Bọc sẵn TanStack Table tích hợp phân trang, bộ lọc dữ liệu nhanh
// ---------------------------------------------

"use client";

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { LoadingSpinner } from "@/components/common/loading-spinner";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  searchKey?: string;
  searchValue?: string;
  pageSize?: number;
  className?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  pageSize = 10,
  className,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingSpinner text="Đang tải dữ liệu..." />
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Table */}
      <div className="rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="border-b border-border/60 bg-muted/40"
              >
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={cn(
                          "flex items-center gap-1.5",
                          header.column.getCanSort() &&
                            "cursor-pointer select-none hover:text-foreground transition-colors"
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanSort() && (
                          <ArrowUpDown className={cn(
                            "h-3 w-3 transition-transform duration-200",
                            header.column.getIsSorted() === "asc" && "rotate-180",
                          )} />
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row, index) => (
                <tr
                  key={row.id}
                  className={cn(
                    "border-b border-border/40 last:border-0 transition-colors duration-150 hover:bg-muted/30",
                    index % 2 === 0 ? "bg-transparent" : "bg-muted/10"
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-sm">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8"
                >
                  <EmptyState />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-muted-foreground px-1">
        <span className="text-xs">
          Trang {table.getPageCount() > 0 ? table.getState().pagination.pageIndex + 1 : 0}{" "}
          / {table.getPageCount()}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-border/60 bg-background hover:bg-muted disabled:opacity-40 transition-colors duration-200"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage() || isLoading}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-border/60 bg-background hover:bg-muted disabled:opacity-40 transition-colors duration-200"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage() || isLoading}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
