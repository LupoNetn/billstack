// ── Password Input Component ─────────────────────────────────────────────────

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Input from './Input';
import { cn } from '@/lib/utils';

interface PasswordInputProps extends React.ComponentProps<typeof Input> {
  showToggle?: boolean;
}

export default function PasswordInput({ showToggle = true, className, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        type={showPassword ? 'text' : 'password'}
        className={cn('pr-10', className)}
        {...props}
      />
      {showToggle && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#111827] transition-colors"
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      )}
    </div>
  );
}
