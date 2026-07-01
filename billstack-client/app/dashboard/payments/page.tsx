'use client';

import { CreditCard, Search, Filter, Download, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatNaira } from '@/lib/utils';

const STATS = [
  { label: 'Total Volume (30d)', value: formatNaira(0), trend: '+0%', up: true },
  { label: 'Successful', value: '0', trend: '+0%', up: true },
  { label: 'Failed', value: '0', trend: '0%', up: false },
  { label: 'Refunded', value: formatNaira(0), trend: '0%', up: true },
];

export default function PaymentsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[24px] font-semibold text-[#111827] tracking-tight">Payments</h2>
          <p className="text-[#6B7280] text-sm">Track and audit all payment transactions.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" /> Export
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat, i) => (
          <div key={i} className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
            <p className="text-xs text-[#6B7280] font-medium uppercase tracking-wider mb-2">{stat.label}</p>
            <p className="text-2xl font-bold text-[#111827] tabular-nums">{stat.value}</p>
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${stat.up ? 'text-[#059669]' : 'text-[#DC2626]'}`}>
              {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {stat.trend} <span className="text-[#9CA3AF] font-normal ml-1">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#9CA3AF]" />
            <Input
              placeholder="Search by customer or transaction ID..."
              className="pl-9 bg-[#F9FAFB] border-[#E5E7EB] focus-visible:ring-[#5B21B6]"
            />
          </div>
          <Button variant="outline" className="gap-2 shrink-0">
            <Filter className="w-4 h-4" /> Filter
          </Button>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F9FAFB] text-[11px] uppercase tracking-wider font-semibold text-[#6B7280] border-b border-[#E5E7EB]">
              <tr>
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center">
                    <CreditCard className="w-10 h-10 text-[#D1D5DB] mb-4" />
                    <h3 className="text-[#111827] font-medium mb-1">No payment transactions yet</h3>
                    <p className="text-[#6B7280] text-sm max-w-[250px]">Payments will appear here when customers are charged for their subscriptions.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
