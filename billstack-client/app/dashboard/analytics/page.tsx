'use client';

import { BarChart2, TrendingUp, Users, RefreshCcw, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-[24px] font-semibold text-[#111827] tracking-tight">Analytics</h2>
          <p className="text-[#6B7280] text-sm">Monitor your subscription metrics, revenue, and churn.</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="bg-white border border-[#E5E7EB] rounded-lg px-3 py-1.5 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#5B21B6]">
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
            <option>This Year</option>
            <option>All Time</option>
          </select>
          <Button className="bg-white text-[#111827] border border-[#E5E7EB] hover:bg-[#F9FAFB] shadow-sm">
            Export CSV
          </Button>
        </div>
      </div>

      {/* KPI Cards Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Monthly Recurring Revenue', value: '₦4,520,000', change: '+12.5%', isUp: true, icon: DollarSign },
          { title: 'Active Subscriptions', value: '1,248', change: '+5.2%', isUp: true, icon: RefreshCcw },
          { title: 'New Customers', value: '84', change: '-2.1%', isUp: false, icon: Users },
          { title: 'Churn Rate', value: '2.4%', change: '-0.4%', isUp: true, icon: TrendingUp },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-5 opacity-5">
              <kpi.icon className="w-16 h-16" />
            </div>
            <p className="text-[#6B7280] text-sm font-medium">{kpi.title}</p>
            <h3 className="text-2xl font-bold text-[#111827] mt-2 tabular-nums">{kpi.value}</h3>
            <div className="flex items-center gap-1 mt-3">
              <span className={`flex items-center text-xs font-medium ${kpi.isUp ? 'text-[#059669]' : 'text-[#DC2626]'}`}>
                {kpi.isUp ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                {kpi.change}
              </span>
              <span className="text-[#9CA3AF] text-xs">vs last period</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Chart Placeholder */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-sm min-h-[400px] flex flex-col">
        <h3 className="text-[#111827] font-semibold mb-6">Revenue Growth</h3>
        <div className="flex-1 flex items-center justify-center border border-dashed border-[#E5E7EB] rounded-lg bg-[#F9FAFB]">
          <div className="text-center">
            <BarChart2 className="w-10 h-10 text-[#D1D5DB] mx-auto mb-3" />
            <p className="text-[#111827] font-medium">Chart visualization loading</p>
            <p className="text-[#6B7280] text-sm max-w-xs mt-1">When connected to the analytics API, MRR and subscriber growth charts will appear here.</p>
          </div>
        </div>
      </div>
      
      {/* Lower Section Placeholders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-sm min-h-[300px] flex flex-col">
          <h3 className="text-[#111827] font-semibold mb-6">Recent Recoveries (Dunning)</h3>
          <div className="flex-1 flex items-center justify-center border border-dashed border-[#E5E7EB] rounded-lg bg-[#F9FAFB]">
            <p className="text-[#6B7280] text-sm">Dunning recovery metrics will appear here.</p>
          </div>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-sm min-h-[300px] flex flex-col">
          <h3 className="text-[#111827] font-semibold mb-6">Subscription Plans Breakdown</h3>
          <div className="flex-1 flex items-center justify-center border border-dashed border-[#E5E7EB] rounded-lg bg-[#F9FAFB]">
            <p className="text-[#6B7280] text-sm">Plan distribution metrics will appear here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
