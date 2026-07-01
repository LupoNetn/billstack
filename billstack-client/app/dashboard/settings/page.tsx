'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileTab from '@/components/dashboard/settings/ProfileTab';
import EmailVerificationTab from '@/components/dashboard/settings/EmailVerificationTab';
import ApiKeysTab from '@/components/dashboard/settings/ApiKeysTab';
import SettlementAccountsTab from '@/components/dashboard/settings/SettlementAccountsTab';
import WebhookConfigTab from '@/components/dashboard/settings/WebhookConfigTab';
import PortalBrandingTab from '@/components/dashboard/settings/PortalBrandingTab';
import SplitConfigTab from '@/components/dashboard/settings/SplitConfigTab';

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-[24px] font-semibold text-[#111827] tracking-tight">Settings</h2>
        <p className="text-[#6B7280] text-sm">Manage your business profile, API keys, webhooks, and billing settings.</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6 inline-flex h-10 items-center justify-center rounded-lg bg-[#F5F3FF] p-1 text-muted-foreground w-auto overflow-x-auto">
          <TabsTrigger value="profile" className="rounded-md px-4 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-[#5B21B6] data-[state=active]:shadow-sm">Profile</TabsTrigger>
          <TabsTrigger value="email" className="rounded-md px-4 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-[#5B21B6] data-[state=active]:shadow-sm">Email Verification</TabsTrigger>
          <TabsTrigger value="apikeys" className="rounded-md px-4 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-[#5B21B6] data-[state=active]:shadow-sm">API Keys</TabsTrigger>
          <TabsTrigger value="settlement" className="rounded-md px-4 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-[#5B21B6] data-[state=active]:shadow-sm">Settlement Accounts</TabsTrigger>
          <TabsTrigger value="webhooks" className="rounded-md px-4 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-[#5B21B6] data-[state=active]:shadow-sm">Webhooks</TabsTrigger>
          <TabsTrigger value="portal" className="rounded-md px-4 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-[#5B21B6] data-[state=active]:shadow-sm">Portal Branding</TabsTrigger>
          <TabsTrigger value="split" className="rounded-md px-4 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-[#5B21B6] data-[state=active]:shadow-sm">Split Config</TabsTrigger>
        </TabsList>

        <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden">
          <TabsContent value="profile" className="p-6 m-0 outline-none">
            <ProfileTab />
          </TabsContent>
          
          <TabsContent value="email" className="p-6 m-0 outline-none">
            <EmailVerificationTab />
          </TabsContent>

          <TabsContent value="apikeys" className="p-6 m-0 outline-none">
            <ApiKeysTab />
          </TabsContent>

          <TabsContent value="settlement" className="p-6 m-0 outline-none">
            <SettlementAccountsTab />
          </TabsContent>

          <TabsContent value="webhooks" className="p-6 m-0 outline-none">
            <WebhookConfigTab />
          </TabsContent>

          <TabsContent value="portal" className="p-6 m-0 outline-none">
            <PortalBrandingTab />
          </TabsContent>

          <TabsContent value="split" className="p-6 m-0 outline-none">
            <SplitConfigTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
