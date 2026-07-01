'use client';

import { Wallet, Search, Filter, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function DVAPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-[24px] font-semibold text-[#111827] tracking-tight">Dedicated Virtual Accounts</h2>
          <p className="text-[#6B7280] text-sm">Provision and manage virtual bank accounts for your customers.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-[#5B21B6] hover:bg-[#7C3AED] text-white gap-2 shadow-sm">
            <Plus className="w-4 h-4" /> Provision DVA
          </Button>
        </div>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#9CA3AF]" />
            <Input
              placeholder="Search by account number or customer..."
              className="pl-9 bg-[#F9FAFB] border-[#E5E7EB] focus-visible:ring-[#5B21B6]"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" /> Filter
          </Button>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left text-sm text-[#6B7280]">
            <thead className="bg-[#F9FAFB] text-[11px] uppercase tracking-wider font-semibold text-[#6B7280] border-b border-[#E5E7EB]">
              <tr>
                <th className="px-6 py-4 font-semibold">Account Details</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Bank Name</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Date Created</th>
                <th className="px-6 py-4 font-semibold text-right"></th>
              </tr>
            </thead>
            <tbody>
              {/* Placeholder Empty State */}
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center">
                    <Wallet className="w-10 h-10 text-[#D1D5DB] mb-4" />
                    <h3 className="text-[#111827] font-medium text-base mb-1">No virtual accounts</h3>
                    <p className="text-[#6B7280] text-sm max-w-[250px]">Virtual accounts allow your customers to pay subscriptions via bank transfer.</p>
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
