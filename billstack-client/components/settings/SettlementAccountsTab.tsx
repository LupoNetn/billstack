'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Building2, X } from 'lucide-react';
import { useSettlementAccounts, useAddSettlementAccount } from '@/lib/queries/merchants';
import { cn } from '@/lib/utils';

const schema = z.object({
  bank_name: z.string().min(1, 'Required'),
  account_number: z.string().length(10, 'Must be 10 digits'),
  account_name: z.string().min(1, 'Required'),
  bank_code: z.string().min(1, 'Required'),
  is_primary: z.boolean().default(false),
  verified: z.boolean().default(false),
  verified_at: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

const inputClass =
  'w-full border border-[#E9E7F0] rounded-lg px-3 py-2.5 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] transition-all';

export default function SettlementAccountsTab() {
  const { data: accounts, isLoading } = useSettlementAccounts();
  const addAccount = useAddSettlementAccount();
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { is_primary: false, verified: false },
  });

  const isPrimary = watch('is_primary');

  function onSubmit(data: FormValues) {
    addAccount.mutate(data, { onSuccess: () => { reset(); setShowForm(false); } });
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="h-24 bg-[#F5F3FF] animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-[#111827]">Bank Accounts</h3>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#5B21B6] border border-[#5B21B6]/30 rounded-lg hover:bg-[#F5F3FF] transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Account
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="border border-[#5B21B6]/20 rounded-xl p-5 bg-[#F5F3FF]/60 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[#111827]">New Bank Account</p>
            <button onClick={() => setShowForm(false)} className="text-[#9CA3AF] hover:text-[#111827]">
              <X className="w-4 h-4" />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#111827]">Bank Name</label>
                <input {...register('bank_name')} placeholder="e.g. Access Bank" className={inputClass} />
                {errors.bank_name && <p className="text-xs text-[#DC2626]">{errors.bank_name.message}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#111827]">Bank Code</label>
                <input {...register('bank_code')} placeholder="e.g. 044" className={inputClass} />
                {errors.bank_code && <p className="text-xs text-[#DC2626]">{errors.bank_code.message}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#111827]">Account Number</label>
              <input {...register('account_number')} placeholder="0123456789" maxLength={10} className={inputClass} />
              {errors.account_number && <p className="text-xs text-[#DC2626]">{errors.account_number.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#111827]">Account Name</label>
              <input {...register('account_name')} placeholder="John Doe" className={inputClass} />
              {errors.account_name && <p className="text-xs text-[#DC2626]">{errors.account_name.message}</p>}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  const el = document.querySelector<HTMLInputElement>('[name="is_primary"]');
                  if (el) el.click();
                }}
                className={cn(
                  'w-10 h-6 rounded-full transition-colors flex items-center',
                  isPrimary ? 'bg-[#5B21B6]' : 'bg-[#E9E7F0]'
                )}
              >
                <input type="checkbox" {...register('is_primary')} className="sr-only" />
                <div className={cn('w-4 h-4 rounded-full bg-white shadow transition-transform mx-1', isPrimary ? 'translate-x-4' : 'translate-x-0')} />
              </button>
              <label className="text-sm text-[#111827]">Set as primary account</label>
            </div>

            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm border border-[#E9E7F0] rounded-lg text-[#6B7280] hover:bg-white">
                Cancel
              </button>
              <button type="submit" disabled={addAccount.isPending} className="px-4 py-2 text-sm font-medium text-white bg-[#5B21B6] rounded-lg hover:bg-[#7C3AED] disabled:opacity-50">
                {addAccount.isPending ? 'Saving…' : 'Add Account'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Empty state */}
      {!accounts?.length && !showForm && (
        <div className="text-center py-12">
          <div className="w-12 h-12 rounded-xl bg-[#F5F3FF] flex items-center justify-center mx-auto mb-3">
            <Building2 className="w-6 h-6 text-[#7C3AED]" />
          </div>
          <p className="text-sm text-[#6B7280]">No settlement accounts yet.</p>
          <button onClick={() => setShowForm(true)} className="mt-3 text-sm text-[#5B21B6] font-medium hover:underline">
            Add your first account →
          </button>
        </div>
      )}

      {/* Account cards */}
      {accounts?.map((acc) => (
        <div key={acc.id} className="border border-[#E9E7F0] rounded-xl p-4 bg-white flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#F5F3FF] flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5 text-[#7C3AED]" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <p className="font-medium text-sm text-[#111827]">{acc.bank_name}</p>
              {acc.is_primary && (
                <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-[#5B21B6]/10 text-[#5B21B6] rounded-md">
                  Primary
                </span>
              )}
              {acc.verified && (
                <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-[#ECFDF5] text-[#059669] rounded-md">
                  Verified
                </span>
              )}
            </div>
            <p className="text-xs text-[#6B7280]">
              {acc.account_name} · ••••{acc.account_number.slice(-4)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
