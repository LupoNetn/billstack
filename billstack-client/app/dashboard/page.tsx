'use client';

import { DollarSign, Users, TrendingUp, Activity, CreditCard, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { formatNaira } from '@/lib/utils';
import { RevenueChart } from '@/components/charts/RevenueChart';
import { SubscriptionGrowthChart } from '@/components/charts/SubscriptionGrowthChart';

export default function DashboardOverviewPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Welcome back</h1>
          <p className="text-sm text-[#6B7280] mt-1">Here's what's happening with your business today.</p>
        </div>
        <button className="px-4 py-2 bg-[#5B21B6] text-white rounded-lg text-sm font-medium hover:bg-[#7C3AED] transition-colors">
          View Reports
        </button>
      </div>

      {/* Unified Metrics Panel */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Primary Metrics (Top Row) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#E5E7EB] border-b border-[#E5E7EB]">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-[#6B7280]" />
              <p className="text-sm font-medium text-[#6B7280]">Monthly Revenue</p>
            </div>
            <div className="flex items-end gap-3 mt-1">
              <h3 className="text-3xl font-bold text-[#111827] tabular-nums tracking-tight">{formatNaira(0)}</h3>
              <div className="flex items-center text-sm font-medium text-[#059669] mb-1">
                ↑ 0%
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-[#6B7280]" />
              <p className="text-sm font-medium text-[#6B7280]">Active Subscriptions</p>
            </div>
            <div className="flex items-end gap-3 mt-1">
              <h3 className="text-3xl font-bold text-[#111827] tabular-nums tracking-tight">0</h3>
              <div className="flex items-center text-sm font-medium text-[#059669] mb-1">
                ↑ 0
              </div>
            </div>
          </div>

          <div className="p-6 bg-[#F5F3FF]/30">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-[#5B21B6]" />
              <p className="text-sm font-medium text-[#5B21B6]">MRR</p>
            </div>
            <div className="flex items-end gap-3 mt-1">
              <h3 className="text-3xl font-bold text-[#111827] tabular-nums tracking-tight">{formatNaira(0)}</h3>
              <div className="flex items-center text-sm font-medium text-[#059669] mb-1">
                ↑ 0%
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-[#6B7280]" />
              <p className="text-sm font-medium text-[#6B7280]">Churn Rate</p>
            </div>
            <div className="flex items-end gap-3 mt-1">
              <h3 className="text-3xl font-bold text-[#111827] tabular-nums tracking-tight">0.0%</h3>
              <div className="flex items-center text-sm font-medium text-[#059669] mb-1">
                ↓ 0%
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Metrics (Bottom Row) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#E5E7EB] bg-[#F9FAFB]/50">
          <div className="px-6 py-4 flex items-center justify-between group cursor-default hover:bg-[#F9FAFB] transition-colors">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4 text-[#6B7280]" />
              </div>
              <div>
                <p className="text-xs text-[#6B7280] font-medium uppercase tracking-wider">ARR</p>
                <p className="text-base font-semibold text-[#111827] tabular-nums">{formatNaira(0)}</p>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 flex items-center justify-between group cursor-default hover:bg-[#F9FAFB] transition-colors">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#FEF2F2] border border-[#FEE2E2] flex items-center justify-center shrink-0">
                <AlertCircle className="w-4 h-4 text-[#DC2626]" />
              </div>
              <div>
                <p className="text-xs text-[#6B7280] font-medium uppercase tracking-wider">Failed Payments</p>
                <p className="text-base font-semibold text-[#111827] tabular-nums">0</p>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 flex items-center justify-between group cursor-default hover:bg-[#F9FAFB] transition-colors">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#FFFBEB] border border-[#FEF3C7] flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-[#D97706]" />
              </div>
              <div>
                <p className="text-xs text-[#6B7280] font-medium uppercase tracking-wider">Pending Invoices</p>
                <p className="text-base font-semibold text-[#111827] tabular-nums">0</p>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 flex items-center justify-between group cursor-default hover:bg-[#F9FAFB] transition-colors">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center shrink-0">
                <Users className="w-4 h-4 text-[#6B7280]" />
              </div>
              <div>
                <p className="text-xs text-[#6B7280] font-medium uppercase tracking-wider">Total Customers</p>
                <p className="text-base font-semibold text-[#111827] tabular-nums">0</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="border border-[#E5E7EB] rounded-xl p-6 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-[#111827]">Revenue Overview</h3>
            <select className="text-sm border border-[#E5E7EB] rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20">
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>This year</option>
            </select>
          </div>
          <RevenueChart />
        </div>

        {/* Subscription Growth Chart */}
        <div className="border border-[#E5E7EB] rounded-xl p-6 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-[#111827]">Subscription Growth</h3>
            <select className="text-sm border border-[#E5E7EB] rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20">
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>This year</option>
            </select>
          </div>
          <SubscriptionGrowthChart />
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 border border-[#E5E7EB] rounded-xl p-6 bg-white shadow-sm">
          <h3 className="text-lg font-semibold text-[#111827] mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-3 hover:bg-[#F9FAFB] rounded-lg transition-colors">
              <div className="w-10 h-10 rounded-full bg-[#ECFDF5] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-[#059669]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#111827]">New subscription created</p>
                <p className="text-xs text-[#6B7280] mt-1">Customer: john@example.com • Plan: Monthly Pro</p>
              </div>
              <span className="text-xs text-[#9CA3AF]">2 min ago</span>
            </div>
            <div className="flex items-start gap-4 p-3 hover:bg-[#F9FAFB] rounded-lg transition-colors">
              <div className="w-10 h-10 rounded-full bg-[#ECFDF5] flex items-center justify-center shrink-0">
                <DollarSign className="w-5 h-5 text-[#059669]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#111827]">Payment received</p>
                <p className="text-xs text-[#6B7280] mt-1">{formatNaira(25000)} from john@example.com</p>
              </div>
              <span className="text-xs text-[#9CA3AF]">15 min ago</span>
            </div>
            <div className="flex items-start gap-4 p-3 hover:bg-[#F9FAFB] rounded-lg transition-colors">
              <div className="w-10 h-10 rounded-full bg-[#FEF2F2] flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-[#DC2626]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#111827]">Payment failed</p>
                <p className="text-xs text-[#6B7280] mt-1">Customer: jane@example.com • Reason: Insufficient funds</p>
              </div>
              <span className="text-xs text-[#9CA3AF]">1 hour ago</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="border border-[#E5E7EB] rounded-xl p-6 bg-white shadow-sm">
          <h3 className="text-lg font-semibold text-[#111827] mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 p-3 border border-[#E5E7EB] rounded-lg hover:bg-[#F5F3FF] hover:border-[#5B21B6] transition-all text-left">
              <div className="w-10 h-10 rounded-lg bg-[#F5F3FF] flex items-center justify-center">
                <Users className="w-5 h-5 text-[#5B21B6]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#111827]">Add Customer</p>
                <p className="text-xs text-[#6B7280]">Create new customer</p>
              </div>
            </button>
            <button className="w-full flex items-center gap-3 p-3 border border-[#E5E7EB] rounded-lg hover:bg-[#F5F3FF] hover:border-[#5B21B6] transition-all text-left">
              <div className="w-10 h-10 rounded-lg bg-[#F5F3FF] flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-[#5B21B6]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#111827]">Create Invoice</p>
                <p className="text-xs text-[#6B7280]">Send manual invoice</p>
              </div>
            </button>
            <button className="w-full flex items-center gap-3 p-3 border border-[#E5E7EB] rounded-lg hover:bg-[#F5F3FF] hover:border-[#5B21B6] transition-all text-left">
              <div className="w-10 h-10 rounded-lg bg-[#F5F3FF] flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#5B21B6]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#111827]">Create Plan</p>
                <p className="text-xs text-[#6B7280]">Add subscription plan</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="border border-[#E5E7EB] rounded-xl p-6 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#111827]">Recent Invoices</h3>
          <button className="text-sm text-[#5B21B6] hover:text-[#7C3AED] font-medium">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5E7EB]">
                <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Invoice</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Customer</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Amount</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5} className="py-8 text-center text-sm text-[#6B7280]">
                  No invoices yet
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
