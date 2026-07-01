'use client';

import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCreatePlan, useUpdatePlan } from '@/lib/queries/plans';
import type { Plan, PlanIntervalUnit } from '@/lib/types';

// ── Zod schema ────────────────────────────────────────────────────────────────
const tierSchema = z.object({
  up_to: z.union([z.number().int().positive(), z.null()]).optional(),
  unit_price: z.number().int().min(0, 'Required'),
  flat_fee: z.number().int().min(0).default(0),
});

const planSchema = z.discriminatedUnion('plan_type', [
  z.object({
    plan_type: z.literal('flat'),
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    amount: z.number().int().min(100, 'Min ₦1'),
    currency: z.string().default('NGN'),
    interval_unit: z.enum(['day', 'week', 'month', 'year']),
    interval_count: z.number().int().min(1).default(1),
    trial_days: z.number().int().min(0).default(0),
    metadata: z.array(z.object({ key: z.string(), value: z.string() })).optional(),
  }),
  z.object({
    plan_type: z.literal('per_unit'),
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    currency: z.string().default('NGN'),
    unit_name: z.string().min(1, 'Unit name required'),
    interval_unit: z.enum(['day', 'week', 'month', 'year']),
    interval_count: z.number().int().min(1).default(1),
    trial_days: z.number().int().min(0).default(0),
    tiers: z.array(tierSchema).min(1, 'Add at least one tier'),
    metadata: z.array(z.object({ key: z.string(), value: z.string() })).optional(),
    amount: z.number().optional(),
  }),
]);

type FormValues = z.infer<typeof planSchema>;

// ── Field components ──────────────────────────────────────────────────────────
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-[#111827]">{label}</label>
      {children}
      {error && <p className="text-xs text-[#DC2626]">{error}</p>}
    </div>
  );
}

const inputClass =
  'w-full border border-[#E9E7F0] rounded-lg px-3 py-2.5 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] transition-all';

interface Props {
  open: boolean;
  onClose: () => void;
  plan?: Plan | null;
}

export default function PlanSlideOver({ open, onClose, plan }: Props) {
  const isEdit = !!plan;
  const [metaOpen, setMetaOpen] = useState(false);
  const [showCustomInterval, setShowCustomInterval] = useState(false);

  const createPlan = useCreatePlan();
  const updatePlan = useUpdatePlan(plan?.id ?? '');

  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(planSchema) as any,
    defaultValues: {
      plan_type: 'flat',
      currency: 'NGN',
      interval_unit: 'month',
      interval_count: 1,
      trial_days: 0,
    },
  });

  const { fields: tierFields, append: addTier, remove: removeTier } = useFieldArray({
    control,
    name: 'tiers' as any,
  });

  const { fields: metaFields, append: addMeta, remove: removeMeta } = useFieldArray({
    control,
    name: 'metadata' as any,
  });

  const planType = watch('plan_type');
  const intervalUnit = watch('interval_unit');

  // Pre-populate when editing
  useEffect(() => {
    if (plan) {
      reset({
        plan_type: plan.plan_type === 'metered' ? 'per_unit' : plan.plan_type,
        name: plan.name,
        description: plan.description ?? '',
        amount: plan.amount,
        currency: plan.currency,
        unit_name: plan.unit_name ?? '',
        interval_unit: plan.interval_unit,
        interval_count: plan.interval_count,
        trial_days: plan.trial_days,
        tiers: plan.tiers?.map((t) => ({ up_to: t.up_to, unit_price: t.unit_price, flat_fee: t.flat_fee })) ?? [],
        metadata: Object.entries(plan.metadata ?? {}).map(([key, value]) => ({ key, value })),
      } as any);
    } else {
      reset({ plan_type: 'flat', currency: 'NGN', interval_unit: 'month', interval_count: 1, trial_days: 0 });
    }
  }, [plan, reset, open]);

  async function onSubmit(values: FormValues) {
    // Convert metadata array → object
    const metaEntries = (values as any).metadata as { key: string; value: string }[] | undefined;
    const metadata = metaEntries?.reduce((acc, { key, value }) => {
      if (key) acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

    const payload: any = { ...values, metadata };
    // Convert kobo: user enters naira, convert to kobo
    if (payload.amount) payload.amount = Math.round(payload.amount * 100);
    if (payload.tiers) {
      payload.tiers = payload.tiers.map((t: any, i: number) => ({
        ...t,
        unit_price: Math.round(t.unit_price * 100),
        flat_fee: Math.round((t.flat_fee ?? 0) * 100),
        up_to: i === payload.tiers.length - 1 ? null : t.up_to,
      }));
    }

    if (isEdit) {
      await updatePlan.mutateAsync(payload);
    } else {
      await createPlan.mutateAsync(payload);
    }
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="relative w-[480px] h-full bg-white shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E9E7F0]">
          <h2 className="text-lg font-semibold text-[#111827]">
            {isEdit ? 'Edit Plan' : 'Create Plan'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F5F3FF] text-[#6B7280] hover:text-[#111827] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Plan Name */}
          <Field label="Plan Name" error={(errors as any).name?.message}>
            <input {...register('name')} placeholder="e.g. Growth Monthly" className={inputClass} />
          </Field>

          {/* Description */}
          <Field label="Description (optional)">
            <textarea
              {...register('description')}
              rows={2}
              placeholder="Briefly describe what's included…"
              className={cn(inputClass, 'resize-none')}
            />
          </Field>

          {/* Plan Type segmented control */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#111827]">Plan Type</label>
            <div className="flex rounded-lg border border-[#E9E7F0] bg-[#F5F3FF] p-1 gap-1">
              {(['flat', 'per_unit'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setValue('plan_type', type)}
                  className={cn(
                    'flex-1 py-2 rounded-md text-sm font-medium transition-all',
                    planType === type
                      ? 'bg-white text-[#5B21B6] shadow-sm'
                      : 'text-[#6B7280] hover:text-[#111827]'
                  )}
                >
                  {type === 'flat' ? 'Flat Rate' : 'Tiered'}
                </button>
              ))}
            </div>
          </div>

          {/* Flat Rate fields */}
          {planType === 'flat' && (
            <Field label="Amount (₦)" error={(errors as any).amount?.message}>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#9CA3AF] font-medium">₦</span>
                <input
                  {...register('amount', { valueAsNumber: true })}
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="0.00"
                  className={cn(inputClass, 'pl-7')}
                />
              </div>
            </Field>
          )}

          {/* Tiered fields */}
          {planType === 'per_unit' && (
            <>
              <Field label="Unit Name" error={(errors as any).unit_name?.message}>
                <input {...register('unit_name')} placeholder="e.g. API call, seat, message" className={inputClass} />
              </Field>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#111827]">Pricing Tiers</label>
                {tierFields.map((field, i) => {
                  const isLast = i === tierFields.length - 1;
                  return (
                    <div key={field.id} className="flex items-center gap-2 p-3 border border-[#E9E7F0] rounded-lg bg-[#FAFAF9]">
                      <div className="flex-1 space-y-1">
                        <p className="text-[10px] uppercase tracking-wide text-[#9CA3AF] font-semibold">Tier {i + 1}</p>
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <label className="text-[11px] text-[#6B7280]">Up to</label>
                            {isLast ? (
                              <input value="Unlimited" disabled className={cn(inputClass, 'bg-[#F5F3FF] text-[#9CA3AF] cursor-not-allowed text-xs')} />
                            ) : (
                              <input
                                {...register(`tiers.${i}.up_to` as any, { valueAsNumber: true })}
                                type="number"
                                placeholder="e.g. 1000"
                                className={inputClass}
                              />
                            )}
                          </div>
                          <div className="flex-1">
                            <label className="text-[11px] text-[#6B7280]">Unit Price (₦)</label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#9CA3AF]">₦</span>
                              <input
                                {...register(`tiers.${i}.unit_price` as any, { valueAsNumber: true })}
                                type="number"
                                min={0}
                                step="0.01"
                                placeholder="0.00"
                                className={cn(inputClass, 'pl-6 text-sm')}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      {tierFields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTier(i)}
                          className="p-1.5 text-[#DC2626] hover:bg-[#FEF2F2] rounded-lg transition-colors shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
                <button
                  type="button"
                  onClick={() => addTier({ up_to: null, unit_price: 0, flat_fee: 0 } as any)}
                  className="flex items-center gap-2 text-sm text-[#5B21B6] hover:text-[#7C3AED] font-medium transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Tier
                </button>
              </div>
            </>
          )}

          {/* Billing Interval */}
          <Field label="Billing Interval" error={(errors as any).interval_unit?.message}>
            <select
              onChange={(e) => {
                const val = e.target.value;
                if (val === 'custom') {
                  setShowCustomInterval(true);
                } else {
                  setShowCustomInterval(false);
                  setValue('interval_unit', val as PlanIntervalUnit);
                  setValue('interval_count', 1);
                }
              }}
              className={inputClass}
            >
              <option value="month">Monthly</option>
              <option value="year">Annual</option>
              <option value="quarter">Quarterly (every 3 months)</option>
              <option value="custom">Custom…</option>
            </select>
          </Field>
          {showCustomInterval && (
            <div className="flex gap-3">
              <Field label="Every" error={(errors as any).interval_count?.message}>
                <input
                  {...register('interval_count', { valueAsNumber: true })}
                  type="number"
                  min={1}
                  className={inputClass}
                />
              </Field>
              <Field label="Unit">
                <select {...register('interval_unit')} className={inputClass}>
                  <option value="day">Day(s)</option>
                  <option value="week">Week(s)</option>
                  <option value="month">Month(s)</option>
                  <option value="year">Year(s)</option>
                </select>
              </Field>
            </div>
          )}

          {/* Trial Days */}
          <Field label="Trial Days" error={(errors as any).trial_days?.message}>
            <input
              {...register('trial_days', { valueAsNumber: true })}
              type="number"
              min={0}
              className={inputClass}
            />
            <p className="text-xs text-[#9CA3AF] mt-1">Leave as 0 for no trial</p>
          </Field>

          {/* Metadata (collapsible) */}
          <div className="border border-[#E9E7F0] rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setMetaOpen((p) => !p)}
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-[#6B7280] hover:bg-[#F5F3FF] transition-colors"
            >
              <span>Metadata (optional)</span>
              {metaOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {metaOpen && (
              <div className="px-4 pb-4 space-y-2 border-t border-[#E9E7F0]">
                <p className="text-xs text-[#9CA3AF] mt-3">
                  Attach custom key-value metadata to this plan
                </p>
                {metaFields.map((field, i) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <input
                      {...register(`metadata.${i}.key` as any)}
                      placeholder="Key"
                      className={cn(inputClass, 'flex-1')}
                    />
                    <input
                      {...register(`metadata.${i}.value` as any)}
                      placeholder="Value"
                      className={cn(inputClass, 'flex-1')}
                    />
                    <button
                      type="button"
                      onClick={() => removeMeta(i)}
                      className="p-1.5 text-[#9CA3AF] hover:text-[#DC2626] transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addMeta({ key: '', value: '' } as any)}
                  className="flex items-center gap-2 text-sm text-[#5B21B6] font-medium"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Field
                </button>
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E9E7F0] bg-white">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-medium text-[#6B7280] border border-[#E9E7F0] rounded-lg hover:bg-[#F5F3FF] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="plan-form"
            disabled={isSubmitting || createPlan.isPending || updatePlan.isPending}
            onClick={handleSubmit(onSubmit)}
            className="px-5 py-2.5 text-sm font-medium text-white bg-[#5B21B6] hover:bg-[#7C3AED] rounded-lg transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
          >
            {(isSubmitting || createPlan.isPending || updatePlan.isPending) && (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {isEdit ? 'Save Changes' : 'Create Plan'}
          </button>
        </div>
      </div>
    </div>
  );
}
