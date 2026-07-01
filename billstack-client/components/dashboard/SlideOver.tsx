'use client';

import { ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  width?: string;
}

export default function SlideOver({ isOpen, onClose, title, children, width = '560px' }: SlideOverProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Slide-over */}
      <div className={cn('fixed right-0 top-0 h-full bg-white z-50 shadow-2xl overflow-y-auto', width)}>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#111827]">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#F5F3FF] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[#6B7280]" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </>
  );
}
