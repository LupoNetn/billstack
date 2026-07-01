'use client';

import { useState, useEffect } from 'react';
import { useGetPortalConfig, useSavePortalConfig } from '@/lib/queries/merchants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Palette, Mail, Link as LinkIcon, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';

export default function PortalBrandingTab() {
  const { data: configResponse, isLoading } = useGetPortalConfig();
  const saveConfig = useSavePortalConfig();
  const config = configResponse?.data;

  const [formData, setFormData] = useState({
    logo_url: '',
    primary_color: '#5B21B6',
    secondary_color: '#F5F3FF',
    support_email: '',
    return_url: '',
    smart_retry_enabled: true
  });

  useEffect(() => {
    if (config) {
      setFormData({
        logo_url: config.logo_url || '',
        primary_color: config.primary_color || '#5B21B6',
        secondary_color: config.secondary_color || '#F5F3FF',
        support_email: config.support_email || '',
        return_url: config.return_url || '',
        smart_retry_enabled: config.smart_retry_enabled ?? true
      });
    }
  }, [config]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveConfig.mutate(formData, {
      onSuccess: () => {
        toast.success('Portal configuration saved');
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || 'Failed to save portal config');
      }
    });
  };

  if (isLoading) {
    return <div className="animate-pulse h-32 bg-gray-100 rounded-lg"></div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
      <div className="max-w-2xl">
        <div className="mb-6">
          <h3 className="text-lg font-medium text-[#111827]">Customer Portal</h3>
          <p className="text-sm text-[#6B7280]">Customize how your brand appears to your customers.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-[#111827] flex items-center gap-2 border-b border-[#E5E7EB] pb-2">
              <Palette className="w-4 h-4 text-[#6B7280]" /> Branding
            </h4>
            
            <div className="grid gap-2">
              <Label htmlFor="logo_url">Logo URL</Label>
              <Input 
                id="logo_url" 
                type="url"
                value={formData.logo_url} 
                onChange={e => setFormData({...formData, logo_url: e.target.value})} 
                placeholder="https://example.com/logo.png" 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="primary_color">Primary Color</Label>
                <div className="flex gap-2">
                  <Input 
                    type="color" 
                    value={formData.primary_color} 
                    onChange={e => setFormData({...formData, primary_color: e.target.value})}
                    className="w-12 p-1 h-10 cursor-pointer"
                  />
                  <Input 
                    id="primary_color" 
                    value={formData.primary_color} 
                    onChange={e => setFormData({...formData, primary_color: e.target.value})} 
                    className="font-mono uppercase"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="secondary_color">Secondary Color</Label>
                <div className="flex gap-2">
                  <Input 
                    type="color" 
                    value={formData.secondary_color} 
                    onChange={e => setFormData({...formData, secondary_color: e.target.value})}
                    className="w-12 p-1 h-10 cursor-pointer"
                  />
                  <Input 
                    id="secondary_color" 
                    value={formData.secondary_color} 
                    onChange={e => setFormData({...formData, secondary_color: e.target.value})} 
                    className="font-mono uppercase"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-[#111827] flex items-center gap-2 border-b border-[#E5E7EB] pb-2">
              <Mail className="w-4 h-4 text-[#6B7280]" /> Contact & Links
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="support_email">Support Email</Label>
                <Input 
                  id="support_email" 
                  type="email"
                  value={formData.support_email} 
                  onChange={e => setFormData({...formData, support_email: e.target.value})} 
                  placeholder="support@yourcompany.com" 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="return_url">Return URL</Label>
                <Input 
                  id="return_url" 
                  type="url"
                  value={formData.return_url} 
                  onChange={e => setFormData({...formData, return_url: e.target.value})} 
                  placeholder="https://yourcompany.com/dashboard" 
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-[#111827] flex items-center gap-2 border-b border-[#E5E7EB] pb-2">
              <RefreshCcw className="w-4 h-4 text-[#6B7280]" /> Billing Automation
            </h4>
            
            <div className="flex items-center justify-between p-4 border border-[#E5E7EB] rounded-lg">
              <div>
                <Label htmlFor="smart_retry" className="text-[#111827] font-medium">Smart Retries</Label>
                <p className="text-sm text-[#6B7280] mt-0.5">Optimize retry scheduling based on Nigerian salary windows.</p>
              </div>
              <Switch 
                id="smart_retry" 
                checked={formData.smart_retry_enabled} 
                onCheckedChange={checked => setFormData({...formData, smart_retry_enabled: checked})}
              />
            </div>
          </div>

          <Button type="submit" disabled={saveConfig.isPending} className="bg-[#5B21B6] hover:bg-[#7C3AED] text-white">
            {saveConfig.isPending ? 'Saving...' : 'Save Branding'}
          </Button>
        </form>
      </div>

      {/* Live Preview Card */}
      <div>
        <div className="sticky top-24 rounded-2xl border border-[#E5E7EB] bg-white shadow-xl overflow-hidden transition-all" style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)' }}>
          <div className="h-24 w-full relative" style={{ backgroundColor: formData.primary_color }}>
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
          </div>
          
          <div className="px-6 pb-6 pt-12 relative flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-xl bg-white shadow-md border border-[#E5E7EB] absolute -top-10 flex items-center justify-center overflow-hidden">
              {formData.logo_url ? (
                <img src={formData.logo_url} alt="Logo" className="w-full h-full object-contain" onError={(e) => { e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%239CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>' }} />
              ) : (
                <div className="w-8 h-8 bg-gray-100 rounded-md"></div>
              )}
            </div>
            
            <h3 className="text-lg font-semibold text-[#111827] mt-2">Manage your subscription</h3>
            <p className="text-sm text-[#6B7280] mb-6">Enter your email to access your billing portal.</p>
            
            <div className="w-full space-y-3">
              <div className="h-10 w-full rounded border border-[#E5E7EB] bg-[#F9FAFB]"></div>
              <div 
                className="h-10 w-full rounded text-white font-medium text-sm flex items-center justify-center transition-colors"
                style={{ backgroundColor: formData.primary_color }}
              >
                Continue
              </div>
            </div>
            
            <p className="text-xs text-[#9CA3AF] mt-6 flex items-center gap-1">
              Powered by <span className="font-semibold text-[#111827]">Billstack</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
