'use client';

import { useState } from 'react';
import { MoreHorizontal, Edit2, Archive, Users, CreditCard } from 'lucide-react';
import { cn, formatNaira, formatBillingCycle } from '@/lib/utils';
import { useArchivePlan } from '@/lib/queries/plans';
import ArchivePlanModal from './ArchivePlanModal';
import type { Plan } from '@/lib/types';

// ── Skeleton ──────────────────────────────────────────────────────────────────
function TableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-16 bg-[#F5F3FF] animate-pulse rounded-lg" />
      ))}
    </div>
  );
}

// ── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium uppercase tracking-wide',
        status === 'active'
          ? 'bg-[#ECFDF5] text-[#059669]'
          : 'bg-[#F5F3FF] text-[#6B7280]'
      )}
    >
      <span
        className={cn(
          'w-1.5 h-1.5 rounded-full',
          status === 'active' ? 'bg-[#059669]' : 'bg-[#9CA3AF]'
        )}
      />
      {status}
    </span>
  );
}

// ── Type badge ────────────────────────────────────────────────────────────────
function TypeBadge({ type }: { type: string }) {
  const isFlat = type === 'flat';
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium uppercase tracking-wide',
        isFlat ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-[#5B21B6]'
      )}
    >
      {isFlat ? 'Flat' : 'Tiered'}
    </span>
  );
}

// ── Actions dropdown ──────────────────────────────────────────────────────────
function ActionsMenu({
  plan,
  onEdit,
  onArchive,
}: {
  plan: Plan;
  onEdit: () => void;
  onArchive: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="p-1.5 rounded-lg hover:bg-[#F5F3FF] text-[#6B7280] hover:text-[#111827] transition-colors"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-8 z-20 w-44 bg-white border border-[#E9E7F0] rounded-xl shadow-lg overflow-hidden py-1">
            <button
              onClick={() => { setOpen(false); onEdit(); }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-[#111827] hover:bg-[#F5F3FF] transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5 text-[#6B7280]" /> Edit
            </button>
            {plan.status !== 'archived' && (
              <button
                onClick={() => { setOpen(false); onArchive(); }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-[#DC2626] hover:bg-[#FEF2F2] transition-colors"
              >
                <Archive className="w-3.5 h-3.5" /> Archive
              </button>
            )}
            <button
              onClick={() => setOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-[#111827] hover:bg-[#F5F3FF] transition-colors"
            >
              <Users className="w-3.5 h-3.5 text-[#6B7280]" /> View Subscribers
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({ onCreateClick }: { onCreateClick?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#F5F3FF] flex items-center justify-center mb-4">
        <CreditCard className="w-8 h-8 text-[#7C3AED]" />
      </div>
      <h3 className="text-base font-semibold text-[#111827] mb-1">No plans yet</h3>
      <p className="text-sm text-[#6B7280] mb-6 max-w-xs">
        Create your first plan to start accepting subscriptions
      </p>
      {onCreateClick && (
        <button
          onClick={onCreateClick}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#5B21B6] hover:bg-[#7C3AED] text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          Create Plan
        </button>
      )}
    </div>
  );
}

// ── Error state ───────────────────────────────────────────────────────────────
function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-sm text-[#DC2626] mb-4">Failed to load plans</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 border border-[#E9E7F0] rounded-lg text-sm font-medium text-[#111827] hover:bg-[#F5F3FF] transition-colors"
      >
        Retry
      </button>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
interface Props {
  plans: Plan[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onEdit: (plan: Plan) => void;
}

export default function PlansTable({ plans, isLoading, isError, onRetry, onEdit }: Props) {
  const [archivingPlan, setArchivingPlan] = useState<Plan | null>(null);
  const { mutate: archivePlan, isPending } = useArchivePlan();

  if (isLoading) return <TableSkeleton />;
  if (isError) return <ErrorState onRetry={onRetry} />;
  if (!plans.length) return <EmptyState />;

  return (
    <>
      <div className="rounded-xl border border-[#E9E7F0] overflow-hidden bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#F5F3FF] border-b border-[#E9E7F0]">
              {['Plan Name', 'Type', 'Price', 'Billing Cycle', 'Active Subs', 'Status', ''].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-widest text-[#9CA3AF]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E9E7F0]">
            {plans.map((plan) => (
              <tr key={plan.id} className="hover:bg-[#FAFAF9] transition-colors">
                <td className="px-4 py-4">
                  <div>
                    <p className="font-medium text-[#111827]">{plan.name}</p>
                    {plan.description && (
                      <p className="text-xs text-[#9CA3AF] mt-0.5 truncate max-w-[200px]">
                        {plan.description}
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <TypeBadge type={plan.plan_type} />
                </td>
                <td className="px-4 py-4 tabular-nums font-medium text-[#111827]">
                  {plan.plan_type === 'flat' ? formatNaira(plan.amount) : `${formatNaira(plan.amount)} / unit`}
                </td>
                <td className="px-4 py-4 text-[#6B7280]">
                  {formatBillingCycle(plan.interval_unit, plan.interval_count)}
                </td>
                <td className="px-4 py-4 tabular-nums text-[#6B7280]">
                  {plan.active_subscribers ?? '—'}
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={plan.status} />
                </td>
                <td className="px-4 py-4">
                  <ActionsMenu
                    plan={plan}
                    onEdit={() => onEdit(plan)}
                    onArchive={() => setArchivingPlan(plan)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ArchivePlanModal
        plan={archivingPlan}
        isLoading={isPending}
        onConfirm={() => {
          if (archivingPlan) {
            archivePlan(archivingPlan.id, { onSuccess: () => setArchivingPlan(null) });
          }
        }}
        onClose={() => setArchivingPlan(null)}
      />
    </>
  );
}
