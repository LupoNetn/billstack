'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm text-[#111827]">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={cn(
          'relative w-11 h-6 rounded-full transition-colors',
          checked ? 'bg-[#5B21B6]' : 'bg-[#E5E7EB]'
        )}
      >
        <span
          className={cn(
            'absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform',
            checked ? 'left-6' : 'left-1'
          )}
        />
      </button>
    </div>
  );
}

export default function NotificationsTab() {
  const [paymentEvents, setPaymentEvents] = useState({
    newSubscription: true,
    paymentFailed: true,
    paymentRecovered: true,
  });

  const [subscriptionEvents, setSubscriptionEvents] = useState({
    trialEnding: true,
    subscriptionCancelled: true,
    subscriptionPaused: false,
  });

  const [reports, setReports] = useState({
    dailyRevenue: false,
    weeklyMRR: false,
  });

  return (
    <div className="space-y-6">
      {/* Payment Events */}
      <div className="border border-[#E5E7EB] rounded-xl p-6 bg-white">
        <h3 className="text-sm font-semibold text-[#111827] mb-4">Payment Events</h3>
        <div className="divide-y divide-[#E5E7EB]">
          <Toggle
            checked={paymentEvents.newSubscription}
            onChange={(checked) => setPaymentEvents({ ...paymentEvents, newSubscription: checked })}
            label="New subscription"
          />
          <Toggle
            checked={paymentEvents.paymentFailed}
            onChange={(checked) => setPaymentEvents({ ...paymentEvents, paymentFailed: checked })}
            label="Payment failed"
          />
          <Toggle
            checked={paymentEvents.paymentRecovered}
            onChange={(checked) => setPaymentEvents({ ...paymentEvents, paymentRecovered: checked })}
            label="Payment recovered"
          />
        </div>
      </div>

      {/* Subscription Events */}
      <div className="border border-[#E5E7EB] rounded-xl p-6 bg-white">
        <h3 className="text-sm font-semibold text-[#111827] mb-4">Subscription Events</h3>
        <div className="divide-y divide-[#E5E7EB]">
          <Toggle
            checked={subscriptionEvents.trialEnding}
            onChange={(checked) => setSubscriptionEvents({ ...subscriptionEvents, trialEnding: checked })}
            label="Trial ending"
          />
          <Toggle
            checked={subscriptionEvents.subscriptionCancelled}
            onChange={(checked) => setSubscriptionEvents({ ...subscriptionEvents, subscriptionCancelled: checked })}
            label="Subscription cancelled"
          />
          <Toggle
            checked={subscriptionEvents.subscriptionPaused}
            onChange={(checked) => setSubscriptionEvents({ ...subscriptionEvents, subscriptionPaused: checked })}
            label="Subscription paused"
          />
        </div>
      </div>

      {/* Reports */}
      <div className="border border-[#E5E7EB] rounded-xl p-6 bg-white">
        <h3 className="text-sm font-semibold text-[#111827] mb-4">Reports</h3>
        <div className="divide-y divide-[#E5E7EB]">
          <Toggle
            checked={reports.dailyRevenue}
            onChange={(checked) => setReports({ ...reports, dailyRevenue: checked })}
            label="Daily revenue summary"
          />
          <Toggle
            checked={reports.weeklyMRR}
            onChange={(checked) => setReports({ ...reports, weeklyMRR: checked })}
            label="Weekly MRR report"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="px-4 py-2 bg-[#5B21B6] text-white rounded-lg text-sm font-medium hover:bg-[#7C3AED] transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
}
