'use client';

import { useState } from 'react';
import { useGetMe, useSendVerificationCode, useVerifyEmailCode } from '@/lib/queries/merchants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, Mail } from 'lucide-react';
import { toast } from 'sonner';

export default function EmailVerificationTab() {
  const { data: meResponse } = useGetMe();
  const merchant = meResponse?.data;
  
  const sendCode = useSendVerificationCode();
  const verifyCode = useVerifyEmailCode();

  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState('');

  const handleSendCode = () => {
    sendCode.mutate(undefined, {
      onSuccess: () => {
        toast.success('Verification code sent to your email');
        setCodeSent(true);
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || 'Failed to send code');
      }
    });
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    verifyCode.mutate(code, {
      onSuccess: () => {
        toast.success('Email verified successfully');
        setCodeSent(false);
        setCode('');
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || 'Invalid code');
      }
    });
  };

  return (
    <div className="max-w-xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-[#111827]">Email Verification</h3>
          <p className="text-sm text-[#6B7280]">Verify your email to unlock all features.</p>
        </div>
        {merchant?.email_verified ? (
          <Badge className="bg-[#ECFDF5] text-[#059669] hover:bg-[#ECFDF5] border-0 px-2 py-0.5"><CheckCircle2 className="w-3 h-3 mr-1" /> Verified</Badge>
        ) : (
          <Badge className="bg-[#FFFBEB] text-[#D97706] hover:bg-[#FFFBEB] border-0 px-2 py-0.5"><AlertCircle className="w-3 h-3 mr-1" /> Unverified</Badge>
        )}
      </div>

      <div className="p-4 border border-[#E5E7EB] rounded-lg bg-[#F9FAFB] flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#EDE9FE] flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5 text-[#5B21B6]" />
          </div>
          <div>
            <p className="text-sm font-medium text-[#111827]">{merchant?.email}</p>
            <p className="text-xs text-[#6B7280]">Primary contact email</p>
          </div>
        </div>

        {!merchant?.email_verified && !codeSent && (
          <Button 
            onClick={handleSendCode} 
            disabled={sendCode.isPending}
            variant="outline"
            className="w-full mt-2"
          >
            {sendCode.isPending ? 'Sending...' : 'Send Verification Code'}
          </Button>
        )}

        {!merchant?.email_verified && codeSent && (
          <form onSubmit={handleVerify} className="mt-4 space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="code" className="text-[#111827]">Enter 6-digit Code</Label>
              <Input 
                id="code" 
                value={code} 
                onChange={e => setCode(e.target.value)} 
                placeholder="000000" 
                maxLength={6}
                className="text-center tracking-widest text-lg font-mono focus-visible:ring-[#5B21B6]"
                required
              />
            </div>
            <Button 
              type="submit" 
              disabled={verifyCode.isPending || code.length !== 6}
              className="w-full bg-[#5B21B6] hover:bg-[#7C3AED] text-white"
            >
              {verifyCode.isPending ? 'Verifying...' : 'Verify Email'}
            </Button>
            <div className="text-center">
              <button 
                type="button" 
                onClick={handleSendCode}
                className="text-xs text-[#5B21B6] hover:underline"
              >
                Resend Code
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
