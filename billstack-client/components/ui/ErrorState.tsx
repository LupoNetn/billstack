'use client';

import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ title = 'Something went wrong', message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-[#FEF2F2] flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-[#DC2626]" />
      </div>
      <h3 className="text-lg font-semibold text-[#111827] mb-2">{title}</h3>
      {message && <p className="text-sm text-[#6B7280] mb-6 max-w-sm">{message}</p>}
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#111827] hover:bg-[#F5F3FF] transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
