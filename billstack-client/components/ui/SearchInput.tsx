'use client';

import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void;
}

export function SearchInput({ className, onSearch, ...props }: SearchInputProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
      <input
        type="text"
        onChange={(e) => onSearch?.(e.target.value)}
        className={cn(
          'pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] transition-all',
          className
        )}
        {...props}
      />
    </div>
  );
}
