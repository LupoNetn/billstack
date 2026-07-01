'use client';

import { FileText, Search, Download, ExternalLink, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function InvoicesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-[24px] font-semibold text-[#111827] tracking-tight">Invoices</h2>
          <p className="text-[#6B7280] text-sm">View and manage subscription invoices.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" /> Filter
          </Button>
          <Button className="bg-[#5B21B6] hover:bg-[#7C3AED] text-white gap-2 shadow-sm">
            <Download className="w-4 h-4" /> Export
          </Button>
        </div>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#9CA3AF]" />
            <Input
              placeholder="Search by invoice number or customer..."
              className="pl-9 bg-[#F9FAFB] border-[#E5E7EB] focus-visible:ring-[#5B21B6]"
            />
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left text-sm text-[#6B7280]">
            <thead className="bg-[#F9FAFB] text-[11px] uppercase tracking-wider font-semibold text-[#6B7280] border-b border-[#E5E7EB]">
              <tr>
                <th className="px-6 py-4 font-semibold">Invoice Number</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right"></th>
              </tr>
            </thead>
            <tbody>
              {/* Placeholder Empty State */}
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center">
                    <FileText className="w-10 h-10 text-[#D1D5DB] mb-4" />
                    <h3 className="text-[#111827] font-medium text-base mb-1">No invoices found</h3>
                    <p className="text-[#6B7280] text-sm max-w-[250px]">Invoices will appear here automatically when customer subscriptions are billed.</p>
                  </div>
                </td>
              </tr>

              {/* Sample Data Row (Commented out visually) */}
              {/* <tr className="border-b border-[#E5E7EB] last:border-0 hover:bg-[#F9FAFB]/50 transition-colors opacity-50">
                <td className="px-6 py-4 font-mono text-[#111827]">INV-2026-001</td>
                <td className="px-6 py-4">
                  <p className="font-medium text-[#111827]">John Doe</p>
                  <p className="text-xs text-[#6B7280]">john@example.com</p>
                </td>
                <td className="px-6 py-4 font-mono text-[#111827]">₦5,000.00</td>
                <td className="px-6 py-4">Jul 1, 2026</td>
                <td className="px-6 py-4"><Badge className="bg-[#ECFDF5] text-[#059669] hover:bg-[#ECFDF5] border-0">Paid</Badge></td>
                <td className="px-6 py-4 text-right">
                  <Button variant="ghost" size="sm" className="h-8 text-[#5B21B6] hover:bg-[#F5F3FF]">
                    <ExternalLink className="w-4 h-4 mr-2" /> View PDF
                  </Button>
                </td>
              </tr> */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
