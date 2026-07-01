'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMerchantMe, useUpdateMerchantProfile } from '@/lib/queries/merchants';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

const schema = z.object({
  personal_name: z.string().min(1, 'Required'),
  business_name: z.string().min(1, 'Required'),
  phone_number: z.string().optional(),
  website_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  business_type: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

const inputClass =
  'w-full border border-[#E9E7F0] rounded-lg px-3 py-2.5 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] transition-all';

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-[#111827]">{label}</label>
      {children}
      {error && <p className="text-xs text-[#DC2626]">{error}</p>}
    </div>
  );
}

export default function BusinessProfileTab() {
  const { data: me, isLoading } = useMerchantMe();
  const updateProfile = useUpdateMerchantProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (me) {
      reset({
        personal_name: me.personal_name,
        business_name: me.business_name ?? '',
        phone_number: me.phone_number ?? '',
        website_url: me.website_url ?? '',
        business_type: me.business_type ?? '',
      });
    }
  }, [me, reset]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-10 bg-[#F5F3FF] animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit((data) => updateProfile.mutate(data))} className="space-y-5 max-w-lg">
      <Field label="Personal Name" error={errors.personal_name?.message}>
        <input {...register('personal_name')} className={inputClass} />
      </Field>
      <Field label="Business Name" error={errors.business_name?.message}>
        <input {...register('business_name')} className={inputClass} />
      </Field>
      <Field label="Phone Number">
        <input {...register('phone_number')} type="tel" className={inputClass} />
      </Field>
      <Field label="Website URL" error={errors.website_url?.message}>
        <input {...register('website_url')} type="url" placeholder="https://" className={inputClass} />
      </Field>
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-[#111827]">Business Type</label>
        <div className="flex items-center gap-2 px-3 py-2.5 border border-[#E9E7F0] rounded-lg bg-[#F5F3FF]">
          <span
            className={cn(
              'inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wide bg-[#5B21B6]/10 text-[#5B21B6]'
            )}
          >
            {me?.business_type ?? '—'}
          </span>
          <span className="text-xs text-[#9CA3AF]">Business type is set during onboarding</span>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={updateProfile.isPending}
          className="px-5 py-2.5 text-sm font-medium text-white bg-[#5B21B6] hover:bg-[#7C3AED] rounded-lg transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
        >
          {updateProfile.isPending && (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          )}
          Save Changes
        </button>
      </div>
    </form>
  );
}
