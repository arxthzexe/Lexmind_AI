'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { CaretDown, CaretUp } from '@phosphor-icons/react';

export interface Column<T> {
  key: Extract<keyof T, string>;
  header: string;
  render?: (value: T[Extract<keyof T, string>], item: T) => React.ReactNode;
  sortable?: boolean;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  className?: string;
  onSort?: (key: Extract<keyof T, string>, direction: 'asc' | 'desc') => void;
  sortKey?: Extract<keyof T, string>;
  sortDirection?: 'asc' | 'desc';
}

export function Table<T extends { id: string | number }>({
  columns,
  data,
  className,
  onSort,
  sortKey,
  sortDirection,
}: TableProps<T>) {
  return (
    <div className={cn('w-full overflow-auto rounded-xl border border-gray-200 bg-white shadow-sm', className)}>
      <table className="w-full text-sm text-left">
        <thead className="bg-[#FAFAFA] text-xs uppercase text-gray-500 tracking-wider sticky top-0 z-10 border-b border-gray-200">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  'px-6 py-4 font-medium',
                  col.sortable && 'cursor-pointer hover:bg-gray-100 transition-colors'
                )}
                onClick={() => {
                  if (col.sortable && onSort) {
                    onSort(col.key, sortKey === col.key && sortDirection === 'asc' ? 'desc' : 'asc');
                  }
                }}
              >
                <div className="flex items-center gap-1">
                  {col.header}
                  {col.sortable && (
                    <div className="flex flex-col">
                      <CaretUp
                        size={12}
                        weight="fill"
                        className={cn(sortKey === col.key && sortDirection === 'asc' ? 'text-[#1E1E2D]' : 'text-gray-300 opacity-50')}
                      />
                      <CaretDown
                        size={12}
                        weight="fill"
                        className={cn('-mt-1', sortKey === col.key && sortDirection === 'desc' ? 'text-[#1E1E2D]' : 'text-gray-300 opacity-50')}
                      />
                    </div>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                {columns.map((col) => (
                  <td key={`${item.id}-${col.key}`} className="px-6 py-4 text-[#1E1E2D]">
                    {col.render ? col.render(item[col.key], item) : item[col.key] as React.ReactNode}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
