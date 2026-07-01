'use client';

import { Archive } from 'lucide-react';
import type { Plan } from '@/lib/types';

interface Props {
  plan: Plan | null;
  isLoading: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ArchivePlanModal({ plan, isLoading, onConfirm, onClose }: Props) {
  if (!plan) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl border border-[#E9E7F0] w-full max-w-md p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#FEF2F2] flex items-center justify-center shrink-0">
            <Archive className="w-5 h-5 text-[#DC2626]" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-[#111827] text-base mb-1">Archive this plan?</h3>
            <p className="text-sm text-[#6B7280] mb-1">
              <span className="font-medium text-[#111827]">{plan.name}</span> will be archived and
              hidden from new subscriptions.
            </p>
            <p className="text-sm text-[#6B7280]">
              Existing subscribers will <strong>not</strong> be affected and will continue on their
              current billing cycle.
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6 justify-end">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-[#6B7280] border border-[#E9E7F0] rounded-lg hover:bg-[#F5F3FF] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-[#DC2626] hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Archiving…
              </>
            ) : (
              'Archive Plan'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
