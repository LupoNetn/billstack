import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'active' | 'trialing' | 'past_due' | 'paused' | 'cancelled' | 'expired' | 'archived' | 'live' | 'test';
  className?: string;
}

const statusConfig: Record<StatusBadgeProps['status'], { label: string; bgColor: string; textColor: string }> = {
  active: { label: 'Active', bgColor: 'bg-[#ECFDF5]', textColor: 'text-[#059669]' },
  trialing: { label: 'Trialing', bgColor: 'bg-[#DBEAFE]', textColor: 'text-[#2563EB]' },
  past_due: { label: 'Past Due', bgColor: 'bg-[#FEF2F2]', textColor: 'text-[#DC2626]' },
  paused: { label: 'Paused', bgColor: 'bg-[#FFFBEB]', textColor: 'text-[#D97706]' },
  cancelled: { label: 'Cancelled', bgColor: 'bg-[#F3F4F6]', textColor: 'text-[#6B7280]' },
  expired: { label: 'Expired', bgColor: 'bg-[#F3F4F6]', textColor: 'text-[#6B7280]' },
  archived: { label: 'Archived', bgColor: 'bg-[#F3F4F6]', textColor: 'text-[#6B7280]' },
  live: { label: 'Live', bgColor: 'bg-[#ECFDF5]', textColor: 'text-[#059669]' },
  test: { label: 'Test', bgColor: 'bg-[#FFFBEB]', textColor: 'text-[#D97706]' },
};

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span className={cn('inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium', config.bgColor, config.textColor, className)}>
      {config.label}
    </span>
  );
}
