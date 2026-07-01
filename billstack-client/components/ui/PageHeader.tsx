'use client';

import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: LucideIcon;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export function PageHeader({ title, description, action, icon: Icon, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="mb-8">
      {breadcrumbs && (
        <nav className="flex items-center gap-2 text-sm text-[#6B7280] mb-4">
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center gap-2">
              {index > 0 && <span className="text-[#E5E7EB]">/</span>}
              {crumb.href ? (
                <a href={crumb.href} className="hover:text-[#5B21B6] transition-colors">
                  {crumb.label}
                </a>
              ) : (
                <span className={index === breadcrumbs.length - 1 ? 'text-[#111827] font-medium' : ''}>
                  {crumb.label}
                </span>
              )}
            </div>
          ))}
        </nav>
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          {Icon && (
            <div className="w-12 h-12 rounded-xl bg-[#F5F3FF] flex items-center justify-center shrink-0">
              <Icon className="w-6 h-6 text-[#5B21B6]" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-[#111827]">{title}</h1>
            {description && <p className="text-sm text-[#6B7280] mt-1">{description}</p>}
          </div>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}
