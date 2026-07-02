'use client';

import { useState } from 'react';
import { useGetPlans } from '@/lib/queries/plans';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Plus, CreditCard, MoreHorizontal, Edit, Archive } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import CreatePlanSlideOver from '@/components/dashboard/plans/CreatePlanSlideOver';
import { formatNaira } from '@/lib/utils';
import { useArchivePlan } from '@/lib/queries/plans';
import { toast } from 'sonner';

export default function PlansPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);

  const { data: plansResponse, isLoading } = useGetPlans(statusFilter !== 'all' ? { status: statusFilter } : undefined);
  const archivePlan = useArchivePlan();
  
  const plans = plansResponse?.data || [];

  const handleOpenCreate = () => {
    setEditingPlan(null);
    setIsSlideOverOpen(true);
  };

  const handleOpenEdit = (plan: any) => {
    setEditingPlan(plan);
    setIsSlideOverOpen(true);
  };

  const handleArchive = (id: string) => {
    if (!confirm('Are you sure you want to archive this plan? It cannot be used for new subscriptions.')) return;
    archivePlan.mutate(id, {
      onSuccess: () => toast.success('Plan archived'),
      onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to archive plan')
    });
  };

  const getStatusBadge = (status: string) => {
    if (status === 'active') return <Badge className="bg-[#ECFDF5] text-[#059669] hover:bg-[#ECFDF5] border-0 px-2 py-0.5 font-medium">Active</Badge>;
    if (status === 'archived') return <Badge className="bg-[#F3F4F6] text-[#6B7280] hover:bg-[#F3F4F6] border-0 px-2 py-0.5 font-medium">Archived</Badge>;
    return <Badge className="bg-[#F3F4F6] text-[#6B7280] hover:bg-[#F3F4F6] border-0 px-2 py-0.5 font-medium">{status}</Badge>;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-[24px] font-semibold text-[#111827] tracking-tight">Plans</h2>
          <p className="text-[#6B7280] text-sm">Create and manage your subscription pricing plans.</p>
        </div>
        <Button onClick={handleOpenCreate} className="bg-[#5B21B6] hover:bg-[#7C3AED] text-white gap-2 shadow-sm">
          <Plus className="w-4 h-4" /> Create Plan
        </Button>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="border-b border-[#E5E7EB] px-4 py-3 flex items-center justify-between bg-white">
          <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-[400px]">
            <TabsList className="bg-[#F5F3FF] p-1 text-muted-foreground inline-flex h-9 items-center justify-center rounded-lg">
              <TabsTrigger value="all" className="rounded-md px-4 py-1 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-[#5B21B6] data-[state=active]:shadow-sm">All Plans</TabsTrigger>
              <TabsTrigger value="active" className="rounded-md px-4 py-1 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-[#5B21B6] data-[state=active]:shadow-sm">Active</TabsTrigger>
              <TabsTrigger value="archived" className="rounded-md px-4 py-1 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-[#5B21B6] data-[state=active]:shadow-sm">Archived</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left text-sm text-[#6B7280]">
            <thead className="bg-[#F9FAFB] text-[11px] uppercase tracking-wider font-semibold text-[#6B7280] border-b border-[#E5E7EB]">
              <tr>
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold">Price</th>
                <th className="px-6 py-4 font-semibold">Cycle</th>
                <th className="px-6 py-4 font-semibold">Status</th>
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
              ) : plans.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center">
                      <CreditCard className="w-10 h-10 text-[#D1D5DB] mb-4" />
                      <h3 className="text-[#111827] font-medium text-base mb-1">No plans found</h3>
                      <p className="text-[#6B7280] text-sm max-w-[250px]">Create your first pricing plan to start subscribing customers.</p>
                      <Button onClick={handleOpenCreate} variant="outline" className="mt-6">
                        Create Plan
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                plans.map((plan: any) => (
                  <tr key={plan.id} className="border-b border-[#E5E7EB] last:border-0 hover:bg-[#F9FAFB]/50 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-medium text-[#111827]">{plan.name}</p>
                      {plan.description && <p className="text-xs text-[#9CA3AF] mt-0.5 line-clamp-1 max-w-[200px]">{plan.description}</p>}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="text-xs font-normal capitalize">
                        {plan.plan_type.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      {plan.plan_type === 'flat_rate' ? (
                        <span className="font-mono text-[#111827]">{formatNaira(plan.amount)}</span>
                      ) : (
                        <span className="font-mono text-[#111827]">Tiered</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-[#111827]">
                      {plan.billing_cadence}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(plan.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="h-4 w-4 text-[#6B7280]" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                          <DropdownMenuItem onClick={() => handleOpenEdit(plan)} className="cursor-pointer gap-2">
                            <Edit className="w-4 h-4 text-[#6B7280]" /> Edit Plan
                          </DropdownMenuItem>
                          {plan.status !== 'archived' && (
                            <DropdownMenuItem onClick={() => handleArchive(plan.id)} className="cursor-pointer gap-2 text-[#D97706] focus:text-[#D97706] focus:bg-[#FFFBEB]">
                              <Archive className="w-4 h-4" /> Archive Plan
                            </DropdownMenuItem>
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

      <CreatePlanSlideOver 
        open={isSlideOverOpen} 
        onOpenChange={setIsSlideOverOpen} 
        plan={editingPlan} 
      />
    </div>
  );
}
