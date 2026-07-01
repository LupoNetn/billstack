'use client';

import { cn } from '@/lib/utils';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-[#E5E7EB]', className)}
      {...props}
    />
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      <div className="h-12 bg-[#F3F4F6] rounded-lg animate-pulse" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-16 bg-[#F3F4F6] rounded-lg animate-pulse" />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="border border-[#E5E7EB] rounded-xl p-6 bg-white">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-[#E5E7EB] animate-pulse" />
        <div className="flex-1">
          <div className="h-4 w-24 bg-[#E5E7EB] rounded animate-pulse mb-2" />
          <div className="h-3 w-16 bg-[#E5E7EB] rounded animate-pulse" />
        </div>
      </div>
      <div className="h-8 w-20 bg-[#E5E7EB] rounded animate-pulse" />
    </div>
  );
}

export function ChartSkeleton({ height = 280 }: { height?: number }) {
  return (
    <div className="border border-[#E5E7EB] rounded-xl p-6 bg-white">
      <div className="h-6 w-32 bg-[#E5E7EB] rounded animate-pulse mb-6" />
      <div style={{ height }} className="bg-[#F9FAFB] rounded-lg animate-pulse" />
    </div>
  );
}
