'use client';

import { useState } from 'react';
import { useGetSplitConfigs, useCreateSplitConfig, useUpdateSplitConfig, useDeleteSplitConfig } from '@/lib/queries/merchants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Share2, Plus, AlertCircle, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function SplitConfigTab() {
  const { data: configsResponse, isLoading } = useGetSplitConfigs();
  const createSplit = useCreateSplitConfig();
  const updateSplit = useUpdateSplitConfig();
  const deleteSplit = useDeleteSplitConfig();
  
  const configs = configsResponse?.data || [];
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    label: '',
    recepient_type: 'third_party',
    split_type: 'percentage',
    value: 10,
    nomba_account_id: '',
    active: true
  });

  const totalPercentage = configs
    .filter((c: any) => c.active && c.split_type === 'percentage')
    .reduce((sum: number, c: any) => sum + (c.value || 0), 0);

  const isExceeding = totalPercentage > 100;

  const handleOpenEdit = (config: any) => {
    setEditingId(config.id);
    setFormData({
      label: config.label,
      recepient_type: config.recepient_type,
      split_type: config.split_type,
      value: config.value,
      nomba_account_id: config.nomba_account_id || '',
      active: config.active
    });
    setIsOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      label: '',
      recepient_type: 'third_party',
      split_type: 'percentage',
      value: 10,
      nomba_account_id: '',
      active: true
    });
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      value: Number(formData.value),
      nomba_account_id: formData.nomba_account_id || undefined
    };

    if (editingId) {
      updateSplit.mutate({ id: editingId, data: payload }, {
        onSuccess: () => {
          toast.success('Split configuration updated');
          setIsOpen(false);
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.message || 'Failed to update configuration');
        }
      });
    } else {
      createSplit.mutate(payload, {
        onSuccess: () => {
          toast.success('Split configuration created');
          setIsOpen(false);
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.message || 'Failed to create configuration');
        }
      });
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this split configuration?')) return;
    deleteSplit.mutate(id, {
      onSuccess: () => toast.success('Split configuration deleted'),
      onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to delete configuration')
    });
  };

  const handleToggleActive = (id: string, active: boolean) => {
    updateSplit.mutate({ id, data: { active } });
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-[#111827]">Split Configurations</h3>
          <p className="text-sm text-[#6B7280]">Automatically route portions of every payment to different accounts.</p>
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button onClick={handleOpenCreate} className="bg-[#5B21B6] hover:bg-[#7C3AED] text-white gap-2">
              <Plus className="w-4 h-4" /> Add Split
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle className="text-[#111827]">{editingId ? 'Edit Split Configuration' : 'Add Split Configuration'}</SheetTitle>
              <SheetDescription className="text-[#6B7280]">
                Configure how funds should be routed.
              </SheetDescription>
            </SheetHeader>
            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="label" className="text-[#111827]">Label</Label>
                <Input 
                  id="label" 
                  value={formData.label} 
                  onChange={e => setFormData({...formData, label: e.target.value})} 
                  placeholder="e.g. Agent Commission" 
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="recepient_type" className="text-[#111827]">Recipient Type</Label>
                <Select value={formData.recepient_type} onValueChange={v => setFormData({...formData, recepient_type: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="platform">Platform (Billstack Fee)</SelectItem>
                    <SelectItem value="merchant">Merchant</SelectItem>
                    <SelectItem value="third_party">Third Party (Agent / Partner)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.recepient_type === 'third_party' && (
                <div className="grid gap-2">
                  <Label htmlFor="nomba_account_id" className="text-[#111827]">Nomba Account ID</Label>
                  <Input 
                    id="nomba_account_id" 
                    value={formData.nomba_account_id} 
                    onChange={e => setFormData({...formData, nomba_account_id: e.target.value})} 
                    placeholder="Enter Nomba Account ID" 
                    required={formData.recepient_type === 'third_party'}
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="split_type" className="text-[#111827]">Split Type</Label>
                  <Select value={formData.split_type} onValueChange={v => setFormData({...formData, split_type: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="value" className="text-[#111827]">{formData.split_type === 'percentage' ? 'Percentage (%)' : 'Amount (kobo)'}</Label>
                  <Input 
                    id="value" 
                    type="number"
                    min="1"
                    max={formData.split_type === 'percentage' ? "100" : undefined}
                    value={formData.value} 
                    onChange={e => setFormData({...formData, value: parseInt(e.target.value) || 0})} 
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border border-[#E5E7EB] rounded-lg bg-[#F9FAFB]">
                <div>
                  <Label htmlFor="active" className="text-[#111827] font-medium">Active Status</Label>
                  <p className="text-xs text-[#6B7280]">Enable or disable this split rule.</p>
                </div>
                <Switch 
                  id="active" 
                  checked={formData.active} 
                  onCheckedChange={checked => setFormData({...formData, active: checked})}
                />
              </div>

              <Button type="submit" disabled={createSplit.isPending || updateSplit.isPending} className="w-full bg-[#5B21B6] hover:bg-[#7C3AED] text-white">
                {createSplit.isPending || updateSplit.isPending ? 'Saving...' : 'Save Configuration'}
              </Button>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      <div className={`mb-6 p-4 rounded-lg flex items-center justify-between ${isExceeding ? 'bg-[#FEF2F2] border border-[#FCA5A5]' : 'bg-[#F9FAFB] border border-[#E5E7EB]'}`}>
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isExceeding ? 'bg-[#FEE2E2]' : 'bg-[#EDE9FE]'}`}>
            {isExceeding ? <AlertCircle className="w-4 h-4 text-[#DC2626]" /> : <Share2 className="w-4 h-4 text-[#5B21B6]" />}
          </div>
          <div>
            <h4 className={`text-sm font-medium ${isExceeding ? 'text-[#991B1B]' : 'text-[#111827]'}`}>Active Percentage Split Total</h4>
            <p className={`text-xs ${isExceeding ? 'text-[#B91C1C]' : 'text-[#6B7280]'}`}>Must not exceed 100%</p>
          </div>
        </div>
        <div className={`text-2xl font-bold tabular-nums ${isExceeding ? 'text-[#DC2626]' : 'text-[#111827]'}`}>
          {totalPercentage}%
        </div>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-16 bg-gray-100 rounded-lg"></div>
          <div className="h-16 bg-gray-100 rounded-lg"></div>
        </div>
      ) : configs.length === 0 ? (
        <div className="text-center py-12 bg-[#F9FAFB] rounded-lg border border-dashed border-[#E5E7EB]">
          <Share2 className="w-8 h-8 text-[#9CA3AF] mx-auto mb-3" />
          <h3 className="text-sm font-medium text-[#111827]">No split configurations</h3>
          <p className="text-xs text-[#6B7280] mt-1">Add a rule to route funds automatically.</p>
        </div>
      ) : (
        <div className="overflow-hidden border border-[#E5E7EB] rounded-lg bg-white">
          <table className="w-full text-left text-sm text-[#6B7280]">
            <thead className="bg-[#F9FAFB] text-xs uppercase text-[#6B7280] border-b border-[#E5E7EB]">
              <tr>
                <th className="px-6 py-4 font-medium">Label</th>
                <th className="px-6 py-4 font-medium">Recipient</th>
                <th className="px-6 py-4 font-medium">Split Rule</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {configs.map((config: any) => (
                <tr key={config.id} className="border-b border-[#E5E7EB] last:border-0 hover:bg-[#F9FAFB] transition-colors">
                  <td className="px-6 py-4 font-medium text-[#111827]">{config.label}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="capitalize">{config.recepient_type.replace('_', ' ')}</span>
                      {config.nomba_account_id && <span className="text-xs text-[#9CA3AF] font-mono">{config.nomba_account_id}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono">
                    {config.split_type === 'percentage' ? `${config.value}%` : `₦${(config.value / 100).toFixed(2)}`}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Switch 
                      checked={config.active} 
                      onCheckedChange={(c) => handleToggleActive(config.id, c)}
                    />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(config)} className="text-[#6B7280] hover:text-[#5B21B6] h-8 w-8">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(config.id)} className="text-[#6B7280] hover:text-[#DC2626] hover:bg-[#FEF2F2] h-8 w-8">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
