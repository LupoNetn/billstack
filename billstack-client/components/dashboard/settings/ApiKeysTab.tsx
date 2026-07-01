'use client';

import { useState } from 'react';
import { useCreateApiKeys } from '@/lib/queries/merchants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Key, Copy, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export default function ApiKeysTab() {
  const createKeys = useCreateApiKeys();
  const [showDialog, setShowDialog] = useState(false);
  const [newKeys, setNewKeys] = useState<{ live: string; test: string } | null>(null);
  const [showLiveKey, setShowLiveKey] = useState(false);
  const [showTestKey, setShowTestKey] = useState(false);

  const handleGenerate = () => {
    if (!confirm('Are you sure you want to regenerate your API keys? Your old keys will instantly stop working.')) return;
    
    createKeys.mutate(undefined, {
      onSuccess: (res: any) => {
        const keys = res?.data;
        if (keys) {
          setNewKeys({ live: keys.live_api_key, test: keys.test_api_key });
          setShowDialog(true);
        }
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || 'Failed to generate API keys');
      }
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-[#111827]">API Keys</h3>
        <p className="text-sm text-[#6B7280]">Use these keys to authenticate API requests from your backend.</p>
      </div>

      <div className="space-y-6">
        <div className="border border-[#E5E7EB] rounded-lg overflow-hidden bg-white">
          <div className="p-4 flex items-center justify-between border-b border-[#E5E7EB]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#ECFDF5] flex items-center justify-center">
                <Key className="w-4 h-4 text-[#059669]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#111827]">Live Environment</p>
                <p className="text-xs text-[#6B7280]">Use this for real transactions</p>
              </div>
            </div>
            <div className="text-sm font-mono text-[#6B7280] bg-[#F9FAFB] px-3 py-1 rounded border border-[#E5E7EB]">
              bsk_live_••••••••••••••••••••••••
            </div>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#FFFBEB] flex items-center justify-center">
                <Key className="w-4 h-4 text-[#D97706]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#111827]">Test Environment</p>
                <p className="text-xs text-[#6B7280]">Use this for testing integration</p>
              </div>
            </div>
            <div className="text-sm font-mono text-[#6B7280] bg-[#F9FAFB] px-3 py-1 rounded border border-[#E5E7EB]">
              bsk_test_••••••••••••••••••••••••
            </div>
          </div>
        </div>

        <div className="bg-[#FEF2F2] border border-[#FCA5A5] rounded-lg p-4 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-[#991B1B]">Regenerate Keys</h4>
            <p className="text-sm text-[#B91C1C] mt-1 mb-3">If your keys are compromised, regenerate them immediately. Old keys will be revoked.</p>
            <Button 
              variant="destructive" 
              onClick={handleGenerate}
              disabled={createKeys.isPending}
              className="bg-[#DC2626] hover:bg-[#B91C1C]"
            >
              {createKeys.isPending ? 'Generating...' : 'Regenerate API Keys'}
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#111827]">Your New API Keys</DialogTitle>
            <DialogDescription className="text-[#D97706] font-medium flex items-center gap-1 mt-2 bg-[#FFFBEB] p-2 rounded text-xs">
              <AlertTriangle className="w-3.5 h-3.5" /> Please copy these now. You won't be able to see them again!
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="grid gap-2">
              <Label className="text-[#111827]">Live Key</Label>
              <div className="flex items-center gap-2">
                <Input 
                  value={newKeys?.live || ''} 
                  readOnly 
                  type={showLiveKey ? "text" : "password"}
                  className="font-mono text-sm bg-[#F9FAFB]" 
                />
                <Button variant="outline" size="icon" onClick={() => setShowLiveKey(!showLiveKey)} className="shrink-0">
                  {showLiveKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button variant="outline" size="icon" onClick={() => copyToClipboard(newKeys?.live || '')} className="shrink-0">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid gap-2">
              <Label className="text-[#111827]">Test Key</Label>
              <div className="flex items-center gap-2">
                <Input 
                  value={newKeys?.test || ''} 
                  readOnly 
                  type={showTestKey ? "text" : "password"}
                  className="font-mono text-sm bg-[#F9FAFB]" 
                />
                <Button variant="outline" size="icon" onClick={() => setShowTestKey(!showTestKey)} className="shrink-0">
                  {showTestKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button variant="outline" size="icon" onClick={() => copyToClipboard(newKeys?.test || '')} className="shrink-0">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
