'use client';

import { useState, useEffect } from 'react';
import { useGetMe, useCompleteOnboarding } from '@/lib/queries/merchants';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfileTab() {
  const { data: meResponse, isLoading } = useGetMe();
  const updateProfile = useCompleteOnboarding();
  const merchant = meResponse?.data;

  const [formData, setFormData] = useState({
    business_name: '',
    buisness_type: '',
    phone_number: '',
    website_url: ''
  });

  useEffect(() => {
    if (merchant) {
      setFormData({
        business_name: merchant.business_name || '',
        buisness_type: merchant.business_type || '',
        phone_number: merchant.phone_number || '',
        website_url: merchant.website_url || ''
      });
    }
  }, [merchant]);

  if (isLoading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      <div className="h-10 bg-gray-200 rounded w-full"></div>
      <div className="h-10 bg-gray-200 rounded w-full"></div>
    </div>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate(formData, {
      onSuccess: () => {
        toast.success('Profile updated successfully');
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || 'Failed to update profile');
      }
    });
  };

  const getStatusBadge = () => {
    if (!merchant) return null;
    if (merchant.status === 'fully_verified') {
      return <Badge className="bg-[#ECFDF5] text-[#059669] hover:bg-[#ECFDF5] border-0 px-2 py-0.5"><CheckCircle2 className="w-3 h-3 mr-1" /> Fully Verified</Badge>;
    }
    if (merchant.status === 'basic_verified') {
      return <Badge className="bg-[#EFF6FF] text-[#2563EB] hover:bg-[#EFF6FF] border-0 px-2 py-0.5"><CheckCircle2 className="w-3 h-3 mr-1" /> Basic Verified</Badge>;
    }
    return <Badge className="bg-[#FFFBEB] text-[#D97706] hover:bg-[#FFFBEB] border-0 px-2 py-0.5"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-[#111827]">Business Profile</h3>
          <p className="text-sm text-[#6B7280]">Update your company details and verification status.</p>
        </div>
        <div>{getStatusBadge()}</div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-2">
          <Label htmlFor="personal_name" className="text-[#111827]">Personal Name</Label>
          <Input id="personal_name" value={merchant?.personal_name || ''} disabled className="bg-[#F9FAFB] text-[#6B7280]" />
          <p className="text-[13px] text-[#6B7280]">Your personal name cannot be changed.</p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email" className="text-[#111827]">Email Address</Label>
          <Input id="email" value={merchant?.email || ''} disabled className="bg-[#F9FAFB] text-[#6B7280]" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="business_name" className="text-[#111827]">Business Name</Label>
            <Input 
              id="business_name" 
              value={formData.business_name} 
              onChange={e => setFormData({...formData, business_name: e.target.value})} 
              placeholder="e.g. Acme Corp" 
              className="focus-visible:ring-[#5B21B6]"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="buisness_type" className="text-[#111827]">Business Type</Label>
            <Select value={formData.buisness_type} onValueChange={v => setFormData({...formData, buisness_type: v})}>
              <SelectTrigger className="focus:ring-[#5B21B6]">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="sole_proprietor">Sole Proprietor</SelectItem>
                <SelectItem value="registered_business">Registered Business</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="phone_number" className="text-[#111827]">Phone Number</Label>
            <Input 
              id="phone_number" 
              value={formData.phone_number} 
              onChange={e => setFormData({...formData, phone_number: e.target.value})} 
              placeholder="+234..." 
              required
              className="focus-visible:ring-[#5B21B6]"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="website_url" className="text-[#111827]">Website URL</Label>
            <Input 
              id="website_url" 
              type="url"
              value={formData.website_url} 
              onChange={e => setFormData({...formData, website_url: e.target.value})} 
              placeholder="https://" 
              className="focus-visible:ring-[#5B21B6]"
            />
          </div>
        </div>

        <Button type="submit" disabled={updateProfile.isPending} className="bg-[#5B21B6] hover:bg-[#7C3AED] text-white">
          {updateProfile.isPending ? 'Saving...' : 'Save Profile'}
        </Button>
      </form>
    </div>
  );
}
