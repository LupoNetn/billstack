import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  pills?: Array<{ label: string; color: string }>;
  className?: string;
}

export default function MetricCard({ label, value, icon: Icon, trend, pills, className }: MetricCardProps) {
  return (
    <div className={cn('border border-[#E5E7EB] rounded-xl p-6 bg-white shadow-sm', className)}>
      {Icon && (
        <div className="w-10 h-10 rounded-lg bg-[#F5F3FF] flex items-center justify-center mb-4">
          <Icon className="w-5 h-5 text-[#5B21B6]" />
        </div>
      )}
      <p className="label-xs mb-2">{label}</p>
      <p className="text-[32px] font-bold text-[#111827] tabular-nums leading-none mb-3">{value}</p>
      
      {trend && (
        <div className="flex items-center gap-1.5 text-sm">
          <span className={cn('font-medium', trend.isPositive ? 'text-[#059669]' : 'text-[#DC2626]')}>
            {trend.isPositive ? '↑' : '↓'} {trend.value}
          </span>
          <span className="text-[#6B7280]">vs last month</span>
        </div>
      )}

      {pills && (
        <div className="flex gap-2 mt-3">
          {pills.map((pill, idx) => (
            <span
              key={idx}
              className={cn(
                'px-2 py-1 rounded-md text-xs font-medium',
                pill.color === 'green' && 'bg-[#ECFDF5] text-[#059669]',
                pill.color === 'blue' && 'bg-[#DBEAFE] text-[#2563EB]',
                pill.color === 'red' && 'bg-[#FEF2F2] text-[#DC2626]',
                pill.color === 'gray' && 'bg-[#F3F4F6] text-[#6B7280]'
              )}
            >
              {pill.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
