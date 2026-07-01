'use client';

import { useState, useEffect } from 'react';
import { useCreatePlan, useUpdatePlan } from '@/lib/queries/plans';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function CreatePlanSlideOver({ open, onOpenChange, plan }: { open: boolean, onOpenChange: (open: boolean) => void, plan?: any }) {
  const createPlan = useCreatePlan();
  const updatePlan = useUpdatePlan();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    plan_type: 'flat_rate',
    amount: '',
    billing_cadence: 'monthly',
    has_trial: false,
    trial_days: ''
  });

  useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name || '',
        description: plan.description || '',
        plan_type: plan.plan_type || 'flat_rate',
        amount: plan.amount ? (plan.amount / 100).toString() : '',
        billing_cadence: plan.billing_cadence || 'monthly',
        has_trial: plan.has_trial || false,
        trial_days: plan.trial_days?.toString() || ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        plan_type: 'flat_rate',
        amount: '',
        billing_cadence: 'monthly',
        has_trial: false,
        trial_days: ''
      });
    }
  }, [plan, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      amount: parseInt(formData.amount) * 100, // Convert to kobo
      trial_days: formData.has_trial ? parseInt(formData.trial_days) : 0,
    };

    if (plan?.id) {
      updatePlan.mutate({ id: plan.id, data: payload }, {
        onSuccess: () => {
          toast.success('Plan updated successfully');
          onOpenChange(false);
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.message || 'Failed to update plan');
        }
      });
    } else {
      createPlan.mutate(payload, {
        onSuccess: () => {
          toast.success('Plan created successfully');
          onOpenChange(false);
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.message || 'Failed to create plan');
        }
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-[#111827]">{plan ? 'Edit Plan' : 'Create New Plan'}</SheetTitle>
          <SheetDescription className="text-[#6B7280]">
            Configure pricing and billing cycle for your subscribers.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="space-y-4 border-b border-[#E5E7EB] pb-6">
            <h4 className="text-sm font-semibold text-[#111827]">Basic Details</h4>
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-[#111827]">Plan Name</Label>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                placeholder="e.g. Pro Monthly" 
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-[#111827]">Description <span className="text-[#6B7280] font-normal">(Optional)</span></Label>
              <Input 
                id="description" 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                placeholder="Brief description of the plan" 
              />
            </div>
          </div>

          <div className="space-y-4 border-b border-[#E5E7EB] pb-6">
            <h4 className="text-sm font-semibold text-[#111827]">Pricing</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="plan_type" className="text-[#111827]">Plan Type</Label>
                <Select value={formData.plan_type} onValueChange={v => setFormData({...formData, plan_type: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flat_rate">Flat Rate</SelectItem>
                    <SelectItem value="tiered" disabled>Tiered (Coming Soon)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="billing_cadence" className="text-[#111827]">Billing Cadence</Label>
                <Select value={formData.billing_cadence} onValueChange={v => setFormData({...formData, billing_cadence: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="biannually">Biannually</SelectItem>
                    <SelectItem value="annually">Annually</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount" className="text-[#111827]">Price (₦)</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-[#6B7280]">₦</span>
                <Input 
                  id="amount" 
                  type="number"
                  min="100"
                  value={formData.amount} 
                  onChange={e => setFormData({...formData, amount: e.target.value})} 
                  placeholder="5000" 
                  className="pl-8"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pb-4">
            <h4 className="text-sm font-semibold text-[#111827]">Trial Period</h4>
            <div className="flex items-center gap-2 mb-2">
              <input 
                type="checkbox" 
                id="has_trial" 
                checked={formData.has_trial}
                onChange={e => setFormData({...formData, has_trial: e.target.checked})}
                className="rounded text-[#5B21B6] focus:ring-[#5B21B6]"
              />
              <Label htmlFor="has_trial" className="text-[#111827]">Offer a free trial</Label>
            </div>
            {formData.has_trial && (
              <div className="grid gap-2 pl-6">
                <Label htmlFor="trial_days" className="text-[#111827]">Trial Duration (Days)</Label>
                <Input 
                  id="trial_days" 
                  type="number"
                  min="1"
                  value={formData.trial_days} 
                  onChange={e => setFormData({...formData, trial_days: e.target.value})} 
                  placeholder="14" 
                  required={formData.has_trial}
                />
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#E5E7EB]">
            <Button type="submit" disabled={createPlan.isPending || updatePlan.isPending} className="w-full bg-[#5B21B6] hover:bg-[#7C3AED] text-white">
              {createPlan.isPending || updatePlan.isPending ? 'Saving...' : plan ? 'Update Plan' : 'Create Plan'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
