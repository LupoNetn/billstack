'use client';

import { useState } from 'react';
import { Code2, Copy, CheckCircle2, Key, Globe, Webhook, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const ENDPOINTS = [
  { method: 'POST', path: '/v1/subscriptions', description: 'Create a new subscription' },
  { method: 'GET', path: '/v1/subscriptions', description: 'List all subscriptions' },
  { method: 'DELETE', path: '/v1/subscriptions/:id/cancel', description: 'Cancel a subscription' },
  { method: 'POST', path: '/v1/plans', description: 'Create a billing plan' },
  { method: 'GET', path: '/v1/plans', description: 'List all plans' },
  { method: 'PATCH', path: '/v1/plans/:id', description: 'Update a plan' },
  { method: 'GET', path: '/v1/merchants/me', description: 'Get merchant profile' },
];

const METHOD_COLORS: Record<string, string> = {
  GET: 'bg-[#ECFDF5] text-[#059669]',
  POST: 'bg-[#EFF6FF] text-[#2563EB]',
  PATCH: 'bg-[#FFFBEB] text-[#D97706]',
  DELETE: 'bg-[#FEF2F2] text-[#DC2626]',
  PUT: 'bg-[#F5F3FF] text-[#5B21B6]',
};

export default function DevelopersPage() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.billstack.io/v1';

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-[24px] font-semibold text-[#111827] tracking-tight">Developers</h2>
        <p className="text-[#6B7280] text-sm">API reference, keys, and integration tools.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Links */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm p-6">
          <h3 className="text-base font-semibold text-[#111827] mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#5B21B6]" /> Resources
          </h3>
          <div className="space-y-2">
            {[
              { icon: BookOpen, label: 'API Documentation', desc: 'Full API reference' },
              { icon: Key, label: 'API Keys', desc: 'Manage your keys' },
              { icon: Webhook, label: 'Webhooks', desc: 'Set up event listeners' },
              { icon: Code2, label: 'SDKs & Libraries', desc: 'Node.js, Go, Python' },
            ].map(({ icon: Icon, label, desc }, i) => (
              <button key={i} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#F5F3FF] group transition-colors text-left">
                <div className="w-9 h-9 rounded-lg bg-[#F5F3FF] flex items-center justify-center shrink-0 group-hover:bg-[#EDE9FE] transition-colors">
                  <Icon className="w-4 h-4 text-[#5B21B6]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#111827]">{label}</p>
                  <p className="text-xs text-[#9CA3AF]">{desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Base URL */}
        <div className="lg:col-span-2 bg-white border border-[#E5E7EB] rounded-xl shadow-sm p-6 flex flex-col gap-6">
          <div>
            <h3 className="text-base font-semibold text-[#111827] mb-1 flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#5B21B6]" /> Base URL
            </h3>
            <p className="text-sm text-[#6B7280] mb-3">All API requests must be made over HTTPS.</p>
            <div className="flex items-center gap-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-4 py-3">
              <code className="flex-1 text-sm font-mono text-[#111827] break-all">{baseUrl}</code>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 h-7 w-7"
                onClick={() => copyToClipboard(baseUrl, -1)}
              >
                {copiedIndex === -1 ? <CheckCircle2 className="w-4 h-4 text-[#059669]" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-base font-semibold text-[#111827] mb-3">Authentication</h3>
            <div className="bg-[#0A0A0A] rounded-lg p-5 text-sm font-mono overflow-x-auto">
              <span className="text-[#9CA3AF]"># Include your API key as a Bearer token in all requests</span>
              <br />
              <span className="text-[#D1D5DB]">Authorization: Bearer </span>
              <span className="text-[#A78BFA]">bsk_live_xxxxxxxxxxxxxxxxxxxx</span>
            </div>
          </div>

          {/* API Reference */}
          <div>
            <h3 className="text-base font-semibold text-[#111827] mb-3 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#5B21B6]" /> Endpoint Reference
            </h3>
            <div className="border border-[#E5E7EB] rounded-lg overflow-hidden">
              {ENDPOINTS.map((ep, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 px-4 py-3 border-b border-[#E5E7EB] last:border-0 hover:bg-[#F9FAFB] transition-colors group"
                >
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${METHOD_COLORS[ep.method] || 'bg-gray-100 text-gray-600'}`}>
                    {ep.method}
                  </span>
                  <code className="text-sm font-mono text-[#111827] flex-1">{ep.path}</code>
                  <span className="text-xs text-[#9CA3AF] hidden sm:block">{ep.description}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                    onClick={() => copyToClipboard(`${baseUrl}${ep.path.replace('/v1', '')}`, i)}
                  >
                    {copiedIndex === i ? <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" /> : <Copy className="w-3.5 h-3.5 text-[#6B7280]" />}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Webhook Events Reference */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm p-6">
        <h3 className="text-base font-semibold text-[#111827] mb-4 flex items-center gap-2">
          <Webhook className="w-4 h-4 text-[#5B21B6]" /> Webhook Events
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            'subscription.created', 'subscription.renewed', 'subscription.canceled',
            'subscription.past_due', 'payment.succeeded', 'payment.failed',
            'customer.created', 'plan.created', 'invoice.paid',
          ].map(event => (
            <div key={event} className="flex items-center gap-3 p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg">
              <div className="w-2 h-2 rounded-full bg-[#5B21B6] shrink-0" />
              <code className="text-xs font-mono text-[#374151]">{event}</code>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
