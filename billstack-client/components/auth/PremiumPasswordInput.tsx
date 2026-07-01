// ── Premium Password Input Component ───────────────────────────────────────────

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import PremiumInput from './PremiumInput';

interface PremiumPasswordInputProps extends React.ComponentProps<typeof PremiumInput> {
  showToggle?: boolean;
}

export default function PremiumPasswordInput({ showToggle = true, className, ...props }: PremiumPasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <PremiumInput
        type={showPassword ? 'text' : 'password'}
        className={cn('pr-12', className)}
        {...props}
      />
      {showToggle && (
        <motion.button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </motion.button>
      )}
    </div>
  );
}
