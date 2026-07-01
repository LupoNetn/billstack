// ── Auth Input Component ─────────────────────────────────────────────────────

import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, type, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-[#111827]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          type={type}
          className={cn(
            'w-full border border-[#E9E7F0] rounded-lg px-4 py-3 text-sm text-[#111827] placeholder:text-[#9CA3AF]',
            'focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6]',
            'transition-all',
            error && 'border-[#DC2626] focus:ring-[#DC2626]/20 focus:border-[#DC2626]',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-[#DC2626]">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
