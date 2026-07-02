'use client';

import { useState } from 'react';
import { useGetSettlementAccounts, useCreateSettlementAccount } from '@/lib/queries/merchants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Building2, Plus, CheckCircle2 } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { toast } from 'sonner';

export default function SettlementAccountsTab() {
  const { data: accountsResponse, isLoading } = useGetSettlementAccounts();
  const createAccount = useCreateSettlementAccount();
  const accounts = accountsResponse?.data || [];
  const [isOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState({
    bank_name: '',
    account_number: '',
    account_name: '',
    bank_code: '',
    is_primary: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createAccount.mutate(formData, {
      onSuccess: () => {
        toast.success('Settlement account added successfully');
        setIsOpen(false);
        setFormData({ bank_name: '', account_number: '', account_name: '', bank_code: '', is_primary: true });
      },
      onError: (err: unknown) => {
        const error = err as { response?: { data?: { message?: string } } };
        toast.error(error.response?.data?.message || 'Failed to add account');
      }
    });
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-[#111827]">Settlement Accounts</h3>
          <p className="text-sm text-[#6B7280]">Where your funds will be paid out.</p>
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger>
            <Button className="bg-[#5B21B6] hover:bg-[#7C3AED] text-white gap-2">
              <Plus className="w-4 h-4" /> Add Account
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle className="text-[#111827]">Add Settlement Account</SheetTitle>
              <SheetDescription className="text-[#6B7280]">
                Enter your bank details to receive payouts.
              </SheetDescription>
            </SheetHeader>
            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="bank_name" className="text-[#111827]">Bank Name</Label>
                <Input 
                  id="bank_name" 
                  value={formData.bank_name} 
                  onChange={e => setFormData({...formData, bank_name: e.target.value})} 
                  placeholder="e.g. GTBank" 
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bank_code" className="text-[#111827]">Bank Code</Label>
                <Input 
                  id="bank_code" 
                  value={formData.bank_code} 
                  onChange={e => setFormData({...formData, bank_code: e.target.value})} 
                  placeholder="e.g. 058" 
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="account_number" className="text-[#111827]">Account Number</Label>
                <Input 
                  id="account_number" 
                  value={formData.account_number} 
                  onChange={e => setFormData({...formData, account_number: e.target.value})} 
                  placeholder="0000000000" 
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="account_name" className="text-[#111827]">Account Name</Label>
                <Input 
                  id="account_name" 
                  value={formData.account_name} 
                  onChange={e => setFormData({...formData, account_name: e.target.value})} 
                  placeholder="Acme Corp" 
                  required
                />
              </div>
              <Button type="submit" disabled={createAccount.isPending} className="w-full bg-[#5B21B6] hover:bg-[#7C3AED] text-white">
                {createAccount.isPending ? 'Adding...' : 'Add Account'}
              </Button>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      {isLoading ? (
        <div className="animate-pulse flex gap-4">
          <div className="h-24 bg-gray-100 rounded-lg w-full"></div>
        </div>
      ) : accounts.length === 0 ? (
        <div className="text-center py-12 bg-[#F9FAFB] rounded-lg border border-dashed border-[#E5E7EB]">
          <Building2 className="w-8 h-8 text-[#9CA3AF] mx-auto mb-3" />
          <h3 className="text-sm font-medium text-[#111827]">No settlement accounts</h3>
          <p className="text-xs text-[#6B7280] mt-1">Add an account to receive your funds.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {accounts.map((acc: Record<string, any>) => (
            <div key={acc.id} className="p-4 rounded-xl border border-[#E5E7EB] bg-white shadow-sm flex items-start justify-between hover:border-[#5B21B6]/30 transition-colors">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#F5F3FF] flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5 text-[#5B21B6]" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-[#111827] text-sm">{acc.bank_name}</p>
                    {acc.is_primary && (
                      <Badge className="bg-[#5B21B6]/10 text-[#5B21B6] hover:bg-[#5B21B6]/10 border-0 px-1.5 py-0 text-[10px]">PRIMARY</Badge>
                    )}
                  </div>
                  <p className="text-[#6B7280] text-sm tabular-nums mb-0.5">
                    •••• {acc.account_number.slice(-4)}
                  </p>
                  <p className="text-[#9CA3AF] text-xs uppercase tracking-wider">{acc.account_name}</p>
                </div>
              </div>
              {acc.verified ? (
                <div className="flex items-center gap-1 text-[#059669] text-xs font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                </div>
              ) : (
                <div className="text-[#D97706] text-xs font-medium bg-[#FFFBEB] px-2 py-1 rounded">Pending Verification</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
