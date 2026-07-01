// ── Premium Input Component ───────────────────────────────────────────────────

'use client';

import { forwardRef, InputHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PremiumInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

const PremiumInput = forwardRef<HTMLInputElement, PremiumInputProps>(
  ({ className, error, label, type, id, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-white/80">
            {label}
          </label>
        )}
        <motion.div
          whileFocus={{ scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <input
            ref={ref}
            id={id}
            type={type}
            className={cn(
              'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5',
              'text-sm text-white placeholder:text-white/40',
              'focus:outline-none focus:border-[#7C3AED]/50 focus:bg-white/10',
              'transition-all duration-200',
              error && 'border-[#DC2626]/50 focus:border-[#DC2626]',
              className
            )}
            {...props}
          />
        </motion.div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-[#DC2626]"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

PremiumInput.displayName = 'PremiumInput';

export default PremiumInput;
