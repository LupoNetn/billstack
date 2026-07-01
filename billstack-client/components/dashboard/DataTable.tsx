'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DataTableProps {
  columns: Array<{ header: string; key: string; className?: string }>;
  children: ReactNode;
  className?: string;
}

export default function DataTable({ columns, children, className }: DataTableProps) {
  return (
    <div className={cn('border border-[#E5E7EB] rounded-xl overflow-hidden bg-white', className)}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn('px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider', column.className)}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {children}
        </tbody>
      </table>
    </div>
  );
}
