'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, RefreshCw, Send } from 'lucide-react';
import { useWebhookConfig, useSaveWebhookConfig, useTestWebhook } from '@/lib/queries/merchants';
import { cn } from '@/lib/utils';

const schema = z.object({
  webhook_url: z.string().url('Must be a valid URL'),
});
type FormValues = z.infer<typeof schema>;

const inputClass =
  'w-full border border-[#E9E7F0] rounded-lg px-3 py-2.5 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] transition-all';

export default function WebhookConfigTab() {
  const { data: config, isLoading } = useWebhookConfig();
  const save = useSaveWebhookConfig();
  const testWebhook = useTestWebhook();
  const [secretVisible, setSecretVisible] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (config) reset({ webhook_url: config.webhook_url });
  }, [config, reset]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-[#F5F3FF] animate-pulse rounded-lg" />
        <div className="h-10 bg-[#F5F3FF] animate-pulse rounded-lg" />
      </div>
    );
  }

  const maskedSecret = config?.webhook_secret
    ? secretVisible
      ? config.webhook_secret
      : '•'.repeat(Math.min(config.webhook_secret.length, 48))
    : '—';

  return (
    <div className="space-y-8 max-w-xl">
      {/* Webhook URL */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-[#111827]">Endpoint URL</h3>
        <form onSubmit={handleSubmit((d) => save.mutate(d))} className="space-y-3">
          <div className="space-y-1.5">
            <input
              {...register('webhook_url')}
              placeholder="https://yourapp.com/webhooks/billstack"
              className={inputClass}
            />
            {errors.webhook_url && <p className="text-xs text-[#DC2626]">{errors.webhook_url.message}</p>}
          </div>
          <button
            type="submit"
            disabled={save.isPending}
            className="px-4 py-2.5 text-sm font-medium text-white bg-[#5B21B6] hover:bg-[#7C3AED] rounded-lg transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
          >
            {save.isPending && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            Save
          </button>
        </form>
      </div>

      {/* Signing Secret */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold text-[#111827]">Signing Secret</h3>
        <p className="text-sm text-[#6B7280]">Use this secret to verify webhook payloads from Billstack.</p>
        <div className="flex items-center gap-2 bg-[#F5F3FF] border border-[#E9E7F0] rounded-lg px-4 py-3">
          <code className={cn('flex-1 text-sm font-mono text-[#111827] truncate', !secretVisible && 'tracking-widest')}>
            {maskedSecret}
          </code>
          <button
            onClick={() => setSecretVisible((v) => !v)}
            className="p-1.5 text-[#6B7280] hover:text-[#111827] transition-colors"
          >
            {secretVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <button className="flex items-center gap-1.5 text-xs font-medium text-[#5B21B6] hover:text-[#7C3AED] transition-colors">
            <RefreshCw className="w-3.5 h-3.5" /> Regenerate
          </button>
        </div>
      </div>

      {/* Test Ping */}
      {config?.webhook_url && (
        <div className="border border-[#E9E7F0] rounded-xl p-5">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium text-[#111827] text-sm">Send Test Event</h4>
              <p className="text-xs text-[#6B7280] mt-1">
                Sends a signed <code className="font-mono bg-[#F5F3FF] px-1 py-0.5 rounded text-[#5B21B6]">billstack.test</code> event to your endpoint.
              </p>
            </div>
            <button
              onClick={() => testWebhook.mutate()}
              disabled={testWebhook.isPending}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium border border-[#E9E7F0] rounded-lg hover:bg-[#F5F3FF] transition-colors disabled:opacity-50"
            >
              {testWebhook.isPending ? (
                <span className="w-4 h-4 border-2 border-[#5B21B6]/30 border-t-[#5B21B6] rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4 text-[#5B21B6]" />
              )}
              Send Test
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
