'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload } from 'lucide-react';
import { usePortalConfig, useSavePortalConfig } from '@/lib/queries/merchants';

const schema = z.object({
  primary_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color'),
  secondary_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  support_email: z.string().email().optional().or(z.literal('')),
  return_url: z.string().url().optional().or(z.literal('')),
  logo_url: z.string().optional(),
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

export default function PortalBrandingTab() {
  const { data: config, isLoading } = usePortalConfig();
  const save = useSavePortalConfig();

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { primary_color: '#5B21B6', secondary_color: '#7C3AED' },
  });

  useEffect(() => {
    if (config) {
      reset({
        primary_color: config.primary_color ?? '#5B21B6',
        secondary_color: config.secondary_color ?? '#7C3AED',
        support_email: config.support_email ?? '',
        return_url: config.return_url ?? '',
        logo_url: config.logo_url ?? '',
      });
    }
  }, [config, reset]);

  const primaryColor = watch('primary_color');
  const secondaryColor = watch('secondary_color');
  const logoUrl = watch('logo_url');

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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Form */}
      <form onSubmit={handleSubmit((data) => save.mutate(data))} className="space-y-5">
        {/* Logo Upload */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-[#111827]">Logo</label>
          <div className="border-2 border-dashed border-[#E9E7F0] rounded-xl p-6 text-center hover:border-[#5B21B6] transition-colors cursor-pointer group">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-[#F5F3FF] group-hover:bg-[#5B21B6]/10 flex items-center justify-center transition-colors">
                <Upload className="w-5 h-5 text-[#7C3AED]" />
              </div>
              <p className="text-sm text-[#6B7280]">
                <span className="font-medium text-[#5B21B6]">Upload logo</span> or drag and drop
              </p>
              <p className="text-xs text-[#9CA3AF]">PNG, SVG up to 2MB</p>
            </div>
          </div>
          <Field label="Or paste logo URL" error={errors.logo_url?.message}>
            <input {...register('logo_url')} placeholder="https://..." className={inputClass} />
          </Field>
        </div>

        {/* Colors */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#111827]">Primary Color</label>
            <div className="flex items-center gap-2 border border-[#E9E7F0] rounded-lg px-3 py-2.5">
              <input type="color" {...register('primary_color')} className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent p-0" />
              <input {...register('primary_color')} placeholder="#5B21B6" className="flex-1 text-sm text-[#111827] outline-none bg-transparent font-mono" />
            </div>
            {errors.primary_color && <p className="text-xs text-[#DC2626]">{errors.primary_color.message}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#111827]">Secondary Color</label>
            <div className="flex items-center gap-2 border border-[#E9E7F0] rounded-lg px-3 py-2.5">
              <input type="color" {...register('secondary_color')} className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent p-0" />
              <input {...register('secondary_color')} placeholder="#7C3AED" className="flex-1 text-sm text-[#111827] outline-none bg-transparent font-mono" />
            </div>
          </div>
        </div>

        <Field label="Support Email" error={errors.support_email?.message}>
          <input {...register('support_email')} type="email" placeholder="support@yourapp.com" className={inputClass} />
        </Field>

        <Field label="Return URL" error={errors.return_url?.message}>
          <input {...register('return_url')} type="url" placeholder="https://yourapp.com/billing" className={inputClass} />
        </Field>

        <button
          type="submit"
          disabled={save.isPending}
          className="px-5 py-2.5 text-sm font-medium text-white bg-[#5B21B6] hover:bg-[#7C3AED] rounded-lg transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
        >
          {save.isPending && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          Save Branding
        </button>
      </form>

      {/* Live Preview */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-[#111827]">Live Preview</p>
        <div className="border border-[#E9E7F0] rounded-2xl overflow-hidden shadow-sm">
          {/* Simulated portal header */}
          <div className="p-5" style={{ background: primaryColor ?? '#5B21B6' }}>
            <div className="flex items-center gap-3">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoUrl} alt="Logo" className="w-10 h-10 rounded-lg object-cover bg-white/10" />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">B</span>
                </div>
              )}
              <span className="text-white font-semibold text-lg">Your Business</span>
            </div>
            <div className="mt-4">
              <p className="text-white/80 text-sm">Manage your subscription</p>
              <p className="text-white/60 text-xs mt-0.5">Powered by Billstack</p>
            </div>
          </div>
          <div className="p-4 bg-white">
            <div className="h-4 w-3/4 bg-[#F5F3FF] rounded-md mb-2" />
            <div className="h-3 w-1/2 bg-[#F5F3FF] rounded-md" />
            <div className="mt-4 flex gap-2">
              <div
                className="h-8 px-4 rounded-lg text-white text-xs flex items-center font-medium"
                style={{ background: secondaryColor ?? '#7C3AED' }}
              >
                Manage Plan
              </div>
              <div className="h-8 px-4 rounded-lg border border-[#E9E7F0] text-xs flex items-center text-[#6B7280]">
                View Invoices
              </div>
            </div>
          </div>
        </div>
        <p className="text-xs text-[#9CA3AF]">This is what your customers will see when they visit their billing portal.</p>
      </div>
    </div>
  );
}
