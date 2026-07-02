'use client';

import { useState } from 'react';
import { useGetSubscriptions, useCancelSubscription, usePauseSubscription } from '@/lib/queries/subscriptions';

interface Subscription {
  id: string;
  customer?: { name?: string; email?: string };
  plan?: { name?: string; amount?: number; billing_cadence?: string };
  status: string;
  current_period_start?: string;
  current_period_end?: string;
}

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { RefreshCcw, Search, MoreHorizontal, XCircle, PauseCircle, PlayCircle, Eye } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { formatNaira } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function SubscriptionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: subscriptionsData, isLoading } = useGetSubscriptions();
  const cancelSubscription = useCancelSubscription();
  const pauseSubscription = usePauseSubscription();
  
  const subscriptions = (subscriptionsData || []).filter((sub: Subscription) =>
  sub.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  sub.plan?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCancel = (id: string) => {
    if (!confirm('Are you sure you want to cancel this subscription immediately?')) return;
    cancelSubscription.mutate(id, {
      onSuccess: () => toast.success('Subscription cancelled'),
      onError: (err: unknown) => {
        const error = err as { response?: { data?: { message?: string } } };
        toast.error(error.response?.data?.message || 'Failed to cancel subscription');
      }
    });
  };

  const handlePause = (id: string, currentStatus: string) => {
    const action = currentStatus === 'paused' ? 'resume' : 'pause';
    const status = currentStatus === 'paused' ? 'active' : 'paused';
    
    if (!confirm(`Are you sure you want to ${action} this subscription?`)) return;
    
    pauseSubscription.mutate({ id, status }, {
      onSuccess: () => toast.success(`Subscription ${action}d`),
      onError: (err: unknown) => {
        const error = err as { response?: { data?: { message?: string } } };
        toast.error(error.response?.data?.message || `Failed to ${action} subscription`);
      }
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-[#ECFDF5] text-[#059669] hover:bg-[#ECFDF5] border-0 px-2 py-0.5 font-medium">Active</Badge>;
      case 'past_due':
        return <Badge className="bg-[#FFFBEB] text-[#D97706] hover:bg-[#FFFBEB] border-0 px-2 py-0.5 font-medium">Past Due</Badge>;
      case 'canceled':
        return <Badge className="bg-[#FEF2F2] text-[#DC2626] hover:bg-[#FEF2F2] border-0 px-2 py-0.5 font-medium">Canceled</Badge>;
      case 'paused':
        return <Badge className="bg-[#F3F4F6] text-[#6B7280] hover:bg-[#F3F4F6] border-0 px-2 py-0.5 font-medium">Paused</Badge>;
      default:
        return <Badge className="bg-[#F3F4F6] text-[#6B7280] hover:bg-[#F3F4F6] border-0 px-2 py-0.5 font-medium capitalize">{status.replace('_', ' ')}</Badge>;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-[24px] font-semibold text-[#111827] tracking-tight">Subscriptions</h2>
          <p className="text-[#6B7280] text-sm">View and manage your active customer subscriptions.</p>
        </div>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#9CA3AF]" />
            <Input
              placeholder="Search by customer email or plan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-[#F9FAFB] border-[#E5E7EB] focus-visible:ring-[#5B21B6]"
            />
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left text-sm text-[#6B7280]">
            <thead className="bg-[#F9FAFB] text-[11px] uppercase tracking-wider font-semibold text-[#6B7280] border-b border-[#E5E7EB]">
              <tr>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Plan</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Current Period</th>
                <th className="px-6 py-4 font-semibold text-right"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex justify-center"><div className="w-6 h-6 border-2 border-[#5B21B6] border-t-transparent rounded-full animate-spin"></div></div>
                  </td>
                </tr>
              ) : subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center">
                      <RefreshCcw className="w-10 h-10 text-[#D1D5DB] mb-4" />
                      <h3 className="text-[#111827] font-medium text-base mb-1">No subscriptions yet</h3>
                      <p className="text-[#6B7280] text-sm max-w-[250px]">When customers subscribe to your plans, they will appear here.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                subscriptions.map((sub: Subscription) => (
                  <tr key={sub.id} className="border-b border-[#E5E7EB] last:border-0 hover:bg-[#F9FAFB]/50 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-medium text-[#111827]">{sub.customer?.name || 'Unknown'}</p>
                      <p className="text-xs text-[#6B7280] mt-0.5">{sub.customer?.email}</p>
                    </td>
                    <td className="px-6 py-4 font-medium text-[#111827]">
                      {sub.plan?.name || 'Unknown Plan'}
                    </td>
                    <td className="px-6 py-4 font-mono text-[#111827]">
                      {formatNaira(sub.plan?.amount || 0)} <span className="text-xs font-sans text-[#6B7280] font-normal">/{sub.plan?.billing_cadence === 'monthly' ? 'mo' : sub.plan?.billing_cadence}</span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(sub.status)}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {sub.current_period_start && sub.current_period_end ? (
                        <span className="tabular-nums">
                          {format(new Date(sub.current_period_start), 'MMM d')} - {format(new Date(sub.current_period_end), 'MMM d, yyyy')}
                        </span>
                      ) : (
                        <span className="text-[#9CA3AF]">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="h-4 w-4 text-[#6B7280]" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                          <DropdownMenuItem className="cursor-pointer gap-2">
                            <Eye className="w-4 h-4 text-[#6B7280]" /> View Details
                          </DropdownMenuItem>
                          
                          {['active', 'paused', 'past_due'].includes(sub.status) && (
                            <>
                              <DropdownMenuItem 
                                onClick={() => handlePause(sub.id, sub.status)} 
                                className="cursor-pointer gap-2"
                              >
                                {sub.status === 'paused' ? (
                                  <><PlayCircle className="w-4 h-4 text-[#059669]" /> <span className="text-[#059669]">Resume</span></>
                                ) : (
                                  <><PauseCircle className="w-4 h-4 text-[#D97706]" /> <span className="text-[#D97706]">Pause</span></>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleCancel(sub.id)} 
                                className="cursor-pointer gap-2 text-[#DC2626] focus:text-[#DC2626] focus:bg-[#FEF2F2]"
                              >
                                <XCircle className="w-4 h-4" /> Cancel Instantly
                              </DropdownMenuItem>
                            </>
                          )}
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
