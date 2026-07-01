'use client';

import { useState, useEffect } from 'react';
import { useGetWebhookConfig, useSetWebhookConfig, useTestWebhook } from '@/lib/queries/merchants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Link2, Zap, Play, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export default function WebhookConfigTab() {
  const { data: configResponse, isLoading } = useGetWebhookConfig();
  const setConfig = useSetWebhookConfig();
  const testWebhook = useTestWebhook();
  
  const config = configResponse?.data;
  
  const [url, setUrl] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  useEffect(() => {
    if (config?.webhook_url) {
      setUrl(config.webhook_url);
    }
  }, [config]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setConfig.mutate({ webhook_url: url }, {
      onSuccess: () => {
        toast.success('Webhook URL saved successfully');
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || 'Failed to save webhook URL');
      }
    });
  };

  const handleTest = () => {
    setTestResult(null);
    testWebhook.mutate(undefined, {
      onSuccess: (res: any) => {
        setTestResult(res.data);
        toast.success('Test ping sent');
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || 'Failed to send test ping');
      }
    });
  };

  if (isLoading) {
    return <div className="animate-pulse h-32 bg-gray-100 rounded-lg max-w-2xl"></div>;
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-[#111827]">Webhook Configuration</h3>
          <p className="text-sm text-[#6B7280]">Receive real-time updates about events in your account.</p>
        </div>
        {config?.webhook_url ? (
          <Badge className="bg-[#ECFDF5] text-[#059669] hover:bg-[#ECFDF5] border-0">Configured</Badge>
        ) : (
          <Badge className="bg-[#F3F4F6] text-[#6B7280] hover:bg-[#F3F4F6] border-0">Not Configured</Badge>
        )}
      </div>

      <div className="space-y-6">
        <form onSubmit={handleSave} className="p-5 border border-[#E5E7EB] rounded-xl bg-white shadow-sm space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="url" className="text-[#111827] flex items-center gap-2">
              <Link2 className="w-4 h-4 text-[#6B7280]" /> Endpoint URL
            </Label>
            <Input 
              id="url" 
              type="url"
              value={url} 
              onChange={e => setUrl(e.target.value)} 
              placeholder="https://api.yourdomain.com/webhooks/billstack" 
              required
              className="focus-visible:ring-[#5B21B6]"
            />
            <p className="text-xs text-[#6B7280]">Events will be sent to this URL as POST requests.</p>
          </div>
          <Button type="submit" disabled={setConfig.isPending} className="bg-[#5B21B6] hover:bg-[#7C3AED] text-white">
            {setConfig.isPending ? 'Saving...' : 'Save Configuration'}
          </Button>
        </form>

        {config?.id && (
          <>
            <div className="p-5 border border-[#E5E7EB] rounded-xl bg-[#F9FAFB] space-y-4">
              <div className="grid gap-2">
                <Label className="text-[#111827] flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#6B7280]" /> Webhook Secret
                </Label>
                <div className="flex items-center gap-2">
                  <Input 
                    value="whsec_••••••••••••••••••••••••" 
                    readOnly 
                    type={showSecret ? "text" : "password"}
                    className="font-mono text-sm bg-white" 
                  />
                  {/* The backend currently doesn't return the raw secret after creation according to PRD, so we might just show a placeholder */}
                </div>
                <p className="text-xs text-[#6B7280]">Use this secret to verify webhook signatures.</p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E5E7EB]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-medium text-[#111827]">Test Webhook</h4>
                  <p className="text-sm text-[#6B7280]">Send a ping event to verify your endpoint works.</p>
                </div>
                <Button onClick={handleTest} disabled={testWebhook.isPending} variant="outline" className="gap-2">
                  <Play className="w-4 h-4" /> {testWebhook.isPending ? 'Sending...' : 'Send Ping'}
                </Button>
              </div>

              {testResult && (
                <div className={`p-4 rounded-lg border text-sm font-mono overflow-x-auto ${testResult.success ? 'bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]' : 'bg-[#FEF2F2] border-[#FECACA] text-[#991B1B]'}`}>
                  <div className="flex items-center gap-2 mb-2 font-sans font-medium">
                    <span className={`w-2 h-2 rounded-full ${testResult.success ? 'bg-[#10B981]' : 'bg-[#EF4444]'}`}></span>
                    HTTP {testResult.status_code || 'Error'} • {testResult.latency_ms}ms
                  </div>
                  {testResult.error && <div>Error: {testResult.error}</div>}
                  {testResult.success && <div>Ping delivered successfully.</div>}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
