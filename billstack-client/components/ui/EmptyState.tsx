'use client';

import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-[#F5F3FF] flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-[#5B21B6]" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-[#111827] mb-2">{title}</h3>
      {description && <p className="text-sm text-[#6B7280] mb-6 max-w-sm">{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#5B21B6] hover:bg-[#7C3AED] text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
