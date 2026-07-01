'use client';

import { useState } from 'react';
import { Users, Search, Filter, Plus, MoreHorizontal, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const MOCK_CUSTOMERS = [
  { id: '1', name: 'Tunde Adeyemi', email: 'tunde@example.com', phone: '+234 801 234 5678', plan: 'Pro Monthly', status: 'active', joined: 'Jan 15, 2026' },
  { id: '2', name: 'Ngozi Okafor', email: 'ngozi@startup.ng', phone: '+234 802 345 6789', plan: 'Basic Monthly', status: 'active', joined: 'Feb 3, 2026' },
  { id: '3', name: 'Emeka Eze', email: 'emeka@techco.ng', phone: '+234 803 456 7890', plan: 'Enterprise', status: 'past_due', joined: 'Mar 10, 2026' },
  { id: '4', name: 'Amaka Obi', email: 'amaka@ngcorp.com', phone: '+234 804 567 8901', plan: 'Pro Monthly', status: 'canceled', joined: 'Apr 22, 2026' },
];

export default function CustomersPage() {
  const [search, setSearch] = useState('');

  const filtered = MOCK_CUSTOMERS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-[#ECFDF5] text-[#059669] hover:bg-[#ECFDF5] border-0 text-xs font-medium">Active</Badge>;
      case 'past_due': return <Badge className="bg-[#FFFBEB] text-[#D97706] hover:bg-[#FFFBEB] border-0 text-xs font-medium">Past Due</Badge>;
      case 'canceled': return <Badge className="bg-[#F3F4F6] text-[#6B7280] hover:bg-[#F3F4F6] border-0 text-xs font-medium">Canceled</Badge>;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[24px] font-semibold text-[#111827] tracking-tight">Customers</h2>
          <p className="text-[#6B7280] text-sm">Manage your subscribers and their billing details.</p>
        </div>
        <Button className="bg-[#5B21B6] hover:bg-[#7C3AED] text-white gap-2 shadow-sm">
          <Plus className="w-4 h-4" /> Add Customer
        </Button>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#9CA3AF]" />
            <Input
              placeholder="Search customers..."
              value={search}
              onChange={e => setSearch(e.target.value)}
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
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Current Plan</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center">
                      <Users className="w-10 h-10 text-[#D1D5DB] mb-4" />
                      <h3 className="text-[#111827] font-medium mb-1">No customers found</h3>
                      <p className="text-[#6B7280] text-sm max-w-[240px]">Customers who subscribe to your plans will appear here.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map(customer => (
                  <tr key={customer.id} className="border-b border-[#E5E7EB] last:border-0 hover:bg-[#F9FAFB]/50 group transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] flex items-center justify-center text-white text-sm font-semibold shrink-0">
                          {customer.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-[#111827]">{customer.name}</p>
                          <p className="text-xs text-[#9CA3AF]">ID: cus_{customer.id.padStart(8, '0')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-[#6B7280] text-xs">
                          <Mail className="w-3 h-3" /> {customer.email}
                        </div>
                        <div className="flex items-center gap-1.5 text-[#6B7280] text-xs">
                          <Phone className="w-3 h-3" /> {customer.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#111827] font-medium">{customer.plan}</td>
                    <td className="px-6 py-4">{getStatusBadge(customer.status)}</td>
                    <td className="px-6 py-4 text-[#6B7280] text-sm">{customer.joined}</td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="h-4 w-4 text-[#6B7280]" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                          <DropdownMenuItem className="cursor-pointer gap-2">View Details</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer gap-2">Send Email</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer gap-2 text-[#DC2626] focus:text-[#DC2626] focus:bg-[#FEF2F2]">Cancel Subscription</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
