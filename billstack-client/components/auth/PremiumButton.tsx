// ── Premium Button Component ──────────────────────────────────────────────────

'use client';

import { forwardRef, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PremiumButtonProps {
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  children: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}

const PremiumButton = forwardRef<HTMLButtonElement, PremiumButtonProps>(
  ({ className, loading, disabled, variant = 'primary', children, type = 'button', onClick }, ref) => {
    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        onClick={onClick}
        whileHover={loading ? undefined : { scale: 1.02 }}
        whileTap={loading ? undefined : { scale: 0.98 }}
        className={cn(
          'inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-medium rounded-xl',
          'transition-all focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          {
            'bg-gradient-to-r from-[#5B21B6] to-[#7C3AED] hover:from-[#6B2BC6] hover:to-[#8C4AFD] text-white shadow-lg shadow-[#5B21B6]/25': variant === 'primary',
            'border border-white/20 bg-white/5 hover:bg-white/10 text-white': variant === 'secondary',
            'hover:bg-white/5 text-white/60 hover:text-white': variant === 'ghost',
          },
          className
        )}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </motion.button>
    );
  }
);

PremiumButton.displayName = 'PremiumButton';

export default PremiumButton;
