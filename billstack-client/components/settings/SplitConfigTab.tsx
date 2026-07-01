'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2, X } from 'lucide-react';
import { useSplitConfigs, useCreateSplitConfig, useDeleteSplitConfig } from '@/lib/queries/merchants';
import { cn } from '@/lib/utils';

const schema = z.object({
  label: z.string().min(1, 'Required'),
  recepient_type: z.enum(['platform', 'merchant', 'third_party']),
  nomba_account_id: z.string().optional(),
  split_type: z.enum(['percentage', 'fixed']),
  value: z.number().min(0, 'Required'),
  active: z.boolean().default(true),
});
type FormValues = z.infer<typeof schema>;

const inputClass =
  'w-full border border-[#E9E7F0] rounded-lg px-3 py-2.5 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] transition-all';

function RecipientBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    platform: 'bg-purple-50 text-[#5B21B6]',
    merchant: 'bg-blue-50 text-blue-700',
    third_party: 'bg-[#FFFBEB] text-[#D97706]',
  };
  return (
    <span className={cn('px-2.5 py-1 rounded-md text-[11px] font-medium uppercase tracking-wide', colors[type] ?? 'bg-[#F5F3FF] text-[#6B7280]')}>
      {type.replace('_', ' ')}
    </span>
  );
}

export default function SplitConfigTab() {
  const { data: splits, isLoading } = useSplitConfigs();
  const createSplit = useCreateSplitConfig();
  const deleteSplit = useDeleteSplitConfig();
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { split_type: 'percentage', recepient_type: 'merchant', active: true },
  });

  const splitType = watch('split_type');

  function onSubmit(data: FormValues) {
    createSplit.mutate(data, { onSuccess: () => { reset(); setShowForm(false); } });
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-20 bg-[#F5F3FF] animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-[#111827]">Revenue Split Configurations</h3>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#5B21B6] border border-[#5B21B6]/30 rounded-lg hover:bg-[#F5F3FF] transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Split Config
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="border border-[#5B21B6]/20 rounded-xl p-5 bg-[#F5F3FF]/60 space-y-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-semibold text-[#111827]">New Split Rule</p>
            <button onClick={() => setShowForm(false)} className="text-[#9CA3AF] hover:text-[#111827]">
              <X className="w-4 h-4" />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#111827]">Label</label>
                <input {...register('label')} placeholder="e.g. Platform fee" className={inputClass} />
                {errors.label && <p className="text-xs text-[#DC2626]">{errors.label.message}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#111827]">Recipient Type</label>
                <select {...register('recepient_type')} className={inputClass}>
                  <option value="platform">Platform</option>
                  <option value="merchant">Merchant</option>
                  <option value="third_party">Third Party</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#111827]">Nomba Account ID (optional)</label>
              <input {...register('nomba_account_id')} placeholder="nomba_acc_..." className={inputClass} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#111827]">Split Type</label>
                <div className="flex rounded-lg border border-[#E9E7F0] bg-white p-1 gap-1">
                  {(['percentage', 'fixed'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => (document.querySelector(`[name="split_type"]`) as HTMLInputElement)?.form?.querySelector(`input[value="${t}"]`)}
                      className={cn(
                        'flex-1 py-1.5 rounded-md text-xs font-medium transition-all',
                        splitType === t ? 'bg-[#5B21B6] text-white' : 'text-[#6B7280]'
                      )}
                    >
                      <input type="radio" {...register('split_type')} value={t} className="sr-only" />
                      {t === 'percentage' ? 'Percentage (%)' : 'Fixed (₦)'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#111827]">Value</label>
                <input
                  {...register('value', { valueAsNumber: true })}
                  type="number"
                  min={0}
                  placeholder={splitType === 'percentage' ? '5 (for 5%)' : '5000 (for ₦50)'}
                  className={inputClass}
                />
                {errors.value && <p className="text-xs text-[#DC2626]">{errors.value.message}</p>}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm border border-[#E9E7F0] rounded-lg text-[#6B7280] hover:bg-white">
                Cancel
              </button>
              <button type="submit" disabled={createSplit.isPending} className="px-4 py-2 text-sm font-medium text-white bg-[#5B21B6] rounded-lg hover:bg-[#7C3AED] disabled:opacity-50">
                {createSplit.isPending ? 'Saving…' : 'Add Config'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Split cards */}
      {!splits?.length && !showForm && (
        <div className="text-center py-12">
          <p className="text-sm text-[#6B7280]">No split configurations yet.</p>
          <button onClick={() => setShowForm(true)} className="mt-3 text-sm text-[#5B21B6] font-medium hover:underline">
            Add your first split rule →
          </button>
        </div>
      )}

      {splits?.map((split) => (
        <div key={split.id} className="border border-[#E9E7F0] rounded-xl p-4 bg-white flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-medium text-sm text-[#111827]">{split.label}</p>
              <RecipientBadge type={split.recepient_type} />
            </div>
            <p className="text-xs text-[#6B7280]">
              {split.split_type === 'percentage' ? `${split.value}%` : `₦${(split.value / 100).toLocaleString()}`} split
              {split.nomba_account_id && ` → ${split.nomba_account_id}`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className={cn('w-9 h-5 rounded-full transition-colors flex items-center', split.active ? 'bg-[#059669]' : 'bg-[#E9E7F0]')}>
              <div className={cn('w-4 h-4 rounded-full bg-white shadow transition-transform mx-0.5', split.active ? 'translate-x-4' : 'translate-x-0')} />
            </div>
            <button
              onClick={() => deleteSplit.mutate(split.id)}
              className="p-1.5 text-[#9CA3AF] hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
