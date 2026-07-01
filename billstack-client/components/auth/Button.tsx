// ── Auth Button Component ────────────────────────────────────────────────────

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, loading, disabled, variant = 'primary', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium rounded-lg',
          'transition-all focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          {
            'bg-[#5B21B6] hover:bg-[#7C3AED] text-white shadow-sm': variant === 'primary',
            'border border-[#E9E7F0] bg-white hover:bg-[#F5F3FF] text-[#111827]': variant === 'secondary',
            'hover:bg-[#F5F3FF] text-[#6B7280]': variant === 'ghost',
          },
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
