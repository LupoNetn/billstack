// ── Glassmorphism Panel Component ─────────────────────────────────────────────

'use client';

import { cn } from '@/lib/utils';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'subtle' | 'bordered';
}

export default function GlassPanel({ children, className, variant = 'default' }: GlassPanelProps) {
  const variants = {
    default: 'bg-white/5 backdrop-blur-xl border border-white/10',
    subtle: 'bg-white/[0.02] backdrop-blur-lg border border-white/5',
    bordered: 'bg-white/5 backdrop-blur-xl border border-white/20',
  };

  return (
    <div className={cn(
      'rounded-2xl shadow-2xl',
      variants[variant],
      className
    )}>
      {children}
    </div>
  );
}
